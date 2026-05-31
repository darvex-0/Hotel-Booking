
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Divider, Input, Modal, Steps, message } from 'antd';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import React, { useState, useMemo } from 'react';
import { Calendar } from 'react-multi-date-picker';
import DatePanel from 'react-multi-date-picker/plugins/date_panel';
import DatePickerHeader from 'react-multi-date-picker/plugins/date_picker_header';
import Toolbar from 'react-multi-date-picker/plugins/toolbar';
import ApiService from '../../utils/apiService';
import notificationWithIcon from '../../utils/notification';

function OrderPlaceModal({ bookingModal, setBookingModal }) {
  const [selectedDates, setSelectedDates] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [upiId, setUpiId] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Stable date limits to prevent calendar re-render navigation freeze
  const minDate = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);

  const maxDate = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 30);
    return date;
  }, []);

  // handle date change on date picker
  const handleDateChange = (dates) => {
    setSelectedDates(dates || []);
  };

  // go to next step (date → payment)
  const handleNext = () => {
    if (selectedDates.length === 0) {
      notificationWithIcon('error', 'ERROR', 'Minimum 1 date selection is required to place a room booking order.');
    } else if (selectedDates.length > 5) {
      notificationWithIcon('error', 'ERROR', 'Maximum 5 days selection possible to place a room booking order.');
    } else {
      setCurrentStep(1);
    }
  };

  // go back to date step
  const handleBack = () => {
    setCurrentStep(0);
  };

  // function to handle placed room booking order with UPI payment
  const handlePlacedOrder = () => {
    if (!upiId.trim()) {
      notificationWithIcon('error', 'ERROR', 'Please enter your UPI ID.');
      return;
    }
    if (!transactionId.trim()) {
      notificationWithIcon('error', 'ERROR', 'Please enter your Transaction ID.');
      return;
    }

    Modal.confirm({
      title: 'Confirm your booking with UPI payment?',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div style={{ marginTop: 10 }}>
          <p><strong>Dates:</strong> {selectedDates.map((date) => dayjs(date.toDate ? date.toDate() : date).format('YYYY-MM-DD')).join(', ')}</p>
          <p><strong>UPI ID:</strong> {upiId}</p>
          <p><strong>Transaction ID:</strong> {transactionId}</p>
        </div>
      ),
      okText: 'Confirm Booking',
      cancelText: 'Cancel',
      onOk() {
        return new Promise((resolve, reject) => {
          setLoading(true);
          const formattedDates = selectedDates.map((date) => dayjs(date.toDate ? date.toDate() : date).format('YYYY-MM-DD'));
          ApiService.post(`/api/v1/placed-booking-order/${bookingModal?.roomId}`, {
            booking_dates: formattedDates,
            upi_id: upiId.trim(),
            transaction_id: transactionId.trim()
          })
            .then((res) => {
              setLoading(false);
              resolve();
              if (res?.result_code === 0) {
                notificationWithIcon('success', 'SUCCESS', (res?.result?.message || 'Your room booking order placed successful. Payment verification is pending.'));
                setBookingModal((prevState) => ({ ...prevState, open: false, roomId: null }));
                router.push('/profile?tab=booking-history');
                setSelectedDates([]);
                setUpiId('');
                setTransactionId('');
                setCurrentStep(0);
              } else {
                notificationWithIcon('error', 'ERROR', 'Sorry! Something went wrong. App server error');
              }
            })
            .catch((err) => {
              setLoading(false);
              notificationWithIcon('error', 'ERROR', (err?.response?.data?.result?.error?.message || err?.message || 'Sorry! Something went wrong. App server error'));
              reject();
            });
        }).catch((err) => message.error(err?.message || 'Oops errors!'));
      }
    });
  };

  // close modal and reset
  const handleClose = () => {
    setBookingModal((prevState) => (
      { ...prevState, open: false, roomId: null }
    ));
    setCurrentStep(0);
    setSelectedDates([]);
    setUpiId('');
    setTransactionId('');
  };

  return (
    <Modal
      title='Book Room'
      open={bookingModal.open}
      onCancel={handleClose}
      closable
      centered
      width={580}
      footer={null}
    >
      {/* Steps indicator */}
      <Steps
        current={currentStep}
        size='small'
        style={{ marginBottom: 24 }}
        items={[
          { title: 'Select Dates' },
          { title: 'UPI Payment' }
        ]}
      />

      {/* Step 1: Date Selection */}
      {currentStep === 0 && (
        <>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Calendar
              style={{ width: '100%' }}
              plugins={[
                <DatePickerHeader
                  key='date-picker-header'
                  position='top'
                  size='medium'
                />,
                <DatePanel
                  style={{ width: '100%' }}
                  key='date-panel'
                  position='right'
                  sort='date'
                />,
                <Toolbar
                  key='toolbar'
                  position='bottom'
                />
              ]}
              minDate={minDate}
              maxDate={maxDate}
              onChange={handleDateChange}
              value={selectedDates}
              format='YYYY/MM/DD'
              highlightToday
              multiple
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
            <Button onClick={handleClose} type='default' size='middle'>
              Cancel
            </Button>
            <Button onClick={handleNext} type='primary' size='middle'>
              Next →
            </Button>
          </div>
        </>
      )}

      {/* Step 2: UPI Payment */}
      {currentStep === 1 && (
        <>
          {/* UPI Payment Info Card */}
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 12,
            padding: '20px 24px',
            color: '#fff',
            marginBottom: 20,
            textAlign: 'center'
          }}>
            <p style={{ margin: 0, fontSize: 13, opacity: 0.85 }}>Pay to this UPI ID</p>
            <h2 style={{
              margin: '8px 0 4px',
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: 0.5,
              color: '#fff'
            }}>
              beachresort@upi
            </h2>
            <p style={{ margin: 0, fontSize: 12, opacity: 0.7 }}>Beach Resort Pvt. Ltd.</p>
          </div>

          <Divider style={{ margin: '16px 0' }}>Enter Your Payment Details</Divider>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, fontSize: 14 }}>
                Your UPI ID
              </label>
              <Input
                placeholder='e.g. yourname@paytm'
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                size='large'
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, fontSize: 14 }}>
                Transaction ID / UTR Number
              </label>
              <Input
                placeholder='e.g. TXN123456789'
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                size='large'
              />
            </div>
          </div>

          {/* Selected dates summary */}
          <div style={{
            background: '#f6f8fa',
            borderRadius: 8,
            padding: '12px 16px',
            marginTop: 16,
            fontSize: 13,
            color: '#555'
          }}>
            <strong>Selected Dates:</strong> {selectedDates.map((date) => dayjs(date.toDate ? date.toDate() : date).format('YYYY-MM-DD')).join(', ')}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
            <Button onClick={handleBack} type='default' size='middle'>
              ← Back
            </Button>
            <Button
              onClick={handlePlacedOrder}
              type='primary'
              size='middle'
              loading={loading}
              disabled={loading}
            >
              Submit Booking
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
}

OrderPlaceModal.defaultProps = {
  bookingModal: { open: false, roomId: null }
};

OrderPlaceModal.propTypes = {
  bookingModal: PropTypes.object
};

export default OrderPlaceModal;

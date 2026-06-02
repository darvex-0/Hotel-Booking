
import {
  Avatar, Button, List, Modal, Rate, Result, Skeleton
} from 'antd';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import useFetchData from '../../hooks/useFetchData';
import ApiService from '../../utils/apiService';
import { getSessionUser } from '../../utils/authentication';
import notificationWithIcon from '../../utils/notification';
import ReviewEditModal from './ReviewEditModal';

function RoomReviewList({ roomId, fetchAgain: fetchAgainProp, setFetchAgain: setFetchAgainProp }) {
  const user = getSessionUser();
  const [fetchAgain, setFetchAgain] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [filter, setFilter] = useState({
    page: 1, limit: 10, sort: 'desc'
  });
  const [reviewEditModal, setReviewEditModal] = useState({
    open: false, reviewId: null, rating: null, message: null
  });

  // fetch user booking history API data
  const [loading, error, response] = useFetchData(`/api/v1/get-room-reviews-list/${roomId}?limit=${filter.limit}&page=${filter.page}&sort=${filter.sort}`, fetchAgainProp !== undefined ? fetchAgainProp : fetchAgain);

  // function to handle review deletion
  const handleDeleteReview = (reviewId) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this review?',
      content: 'This action cannot be undone. Once deleted, your booking status will be set back so you can write a review again.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'No, Keep',
      centered: true,
      onOk: () => {
        setDeleteLoadingId(reviewId);
        ApiService.delete(`/api/v1/delete-room-review/${reviewId}`)
          .then((res) => {
            setDeleteLoadingId(null);
            if (res?.result_code === 0) {
              notificationWithIcon('success', 'SUCCESS', res?.result?.message || 'Your review has been deleted successfully');
              if (setFetchAgainProp) {
                setFetchAgainProp((prevState) => !prevState);
              } else {
                setFetchAgain((prevState) => !prevState);
              }
            } else {
              notificationWithIcon('error', 'ERROR', 'Sorry! Something went wrong. App server error');
            }
          })
          .catch((err) => {
            setDeleteLoadingId(null);
            notificationWithIcon('error', 'ERROR', err?.response?.data?.result?.error?.message || err?.response?.data?.result?.error || 'Sorry! Something went wrong. App server error');
          });
      }
    });
  };

  return (
    <>
      {error ? (
        <Result
          title='Failed to fetch'
          subTitle={error}
          status='500'
          extra={(
            <Button
              onClick={() => setFetchAgain(!fetchAgain)}
              type='primary'
              size='large'
              loading={loading}
              disabled={loading}
            >
              Try to Again
            </Button>
          )}
        />
      ) : (
        <List
          className='demo-load-more-list'
          itemLayout='horizontal'
          header={<h2>Reviews & Rating:</h2>}
          loading={loading}
          dataSource={response?.data?.rows}
          loadMore={response?.data?.total_page > 1 ? (
            <div
              style={{
                textAlign: 'center',
                marginTop: 12,
                height: 32,
                lineHeight: '32px'
              }}
            >
              <Button
                type='default'
                size='large'
                onClick={() => setFilter((prevState) => (
                  { ...prevState, limit: filter.limit + 5 }
                ))}
              >
                Loading more...
              </Button>
            </div>
          ) : null}
          renderItem={(item) => (
            <List.Item
              actions={[
                <div key='review-actions' style={{ display: 'flex', gap: '10px' }}>
                  {user?.id === item?.reviews_by?.id && (
                    <>
                      <Button
                        type='primary'
                        size='large'
                        onClick={() => setReviewEditModal((prevState) => ({
                          ...prevState, open: true, reviewId: item?.id, rating: item?.rating, message: item?.message
                        }))}
                      >
                        Edit Your Review & Rating
                      </Button>
                      <Button
                        type='primary'
                        danger
                        size='large'
                        loading={deleteLoadingId === item?.id}
                        onClick={() => handleDeleteReview(item?.id)}
                      >
                        Delete Review
                      </Button>
                    </>
                  )}
                </div>
              ]}
            >
              <Skeleton
                title={false}
                loading={loading}
                avatar
                active
              >
                <List.Item.Meta
                  avatar={(
                    <Avatar
                      src={item?.reviews_by?.avatar || 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg'}
                    />
                  )}
                  title={item?.reviews_by?.fullName || 'N/A'}
                  description={item?.message}
                />
                <div>
                  <Rate value={item?.rating} disabled />
                </div>
              </Skeleton>
            </List.Item>
          )}
        />
      )}

      {/* review & rating edit modal */}
      {reviewEditModal?.open && (
        <ReviewEditModal
          reviewEditModal={reviewEditModal}
          setReviewEditModal={setReviewEditModal}
          setFetchAgain={setFetchAgainProp || setFetchAgain}
        />
      )}
    </>
  );
}

RoomReviewList.defaultProps = {
  roomId: '',
  fetchAgain: undefined,
  setFetchAgain: undefined
};

RoomReviewList.propTypes = {
  roomId: PropTypes.string,
  fetchAgain: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  setFetchAgain: PropTypes.func
};

export default RoomReviewList;

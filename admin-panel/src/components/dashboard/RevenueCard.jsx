import { Card, Statistic } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const gridStyle = { width: '33.33%', textAlign: 'center' };

function RevenueCard({ loading, data }) {
  const navigate = useNavigate();

  return (
    <Card
      className='w-full cursor-pointer md:w-[49.5%]'
      onClick={() => navigate('/main/booking-orders')}
      title='Revenue Information:'
      loading={loading}
    >
      <Card.Grid style={gridStyle}>
        <Statistic
          className='whitespace-normal lg:whitespace-nowrap'
          title='Earned Revenue'
          prefix='$'
          precision={2}
          value={data?.total_revenue || 0}
          valueStyle={{ color: '#3f8600' }}
        />
      </Card.Grid>

      <Card.Grid style={gridStyle}>
        <Statistic
          className='whitespace-normal lg:whitespace-nowrap'
          title='Pending Revenue'
          prefix='$'
          precision={2}
          value={data?.pending_revenue || 0}
          valueStyle={{ color: '#d48806' }}
        />
      </Card.Grid>

      <Card.Grid style={gridStyle}>
        <Statistic
          className='whitespace-normal lg:whitespace-nowrap'
          title='Potential Revenue'
          prefix='$'
          precision={2}
          value={data?.potential_revenue || 0}
          valueStyle={{ color: '#096dd9' }}
        />
      </Card.Grid>
    </Card>
  );
}

export default RevenueCard;

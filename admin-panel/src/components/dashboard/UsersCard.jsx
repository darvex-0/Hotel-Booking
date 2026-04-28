import { Card, Statistic } from 'antd';
import React from 'react';
import CountUp from 'react-countup';
import { useNavigate } from 'react-router-dom';

const formatter = (value) => <CountUp end={value} separator=',' />;
const gridStyle = { width: '25%', textAlign: 'center' };

function UsersCard({ loading, data }) {
  const navigate = useNavigate();

  return (
    <Card
      className='w-full cursor-pointer md:w-[49.5%]'
      onClick={() => navigate('/main/users')}
      title='Users Information:'
      loading={loading}
    >
      <Card.Grid style={gridStyle}>
        <Statistic
          className='whitespace-normal lg:whitespace-nowrap'
          title='Total Users'
          formatter={formatter}
          value={data?.total_users || 0}
        />
      </Card.Grid>

      <Card.Grid style={gridStyle}>
        <Statistic
          className='whitespace-normal lg:whitespace-nowrap'
          title='Admin Role Users'
          formatter={formatter}
          value={data?.admin_role_user || 0}
        />
      </Card.Grid>

      <Card.Grid style={gridStyle}>
        <Statistic
          className='whitespace-normal lg:whitespace-nowrap'
          title='User Role Users'
          formatter={formatter}
          value={data?.user_role_user || 0}
        />
      </Card.Grid>

      <Card.Grid style={gridStyle}>
        <Statistic
          className='whitespace-normal lg:whitespace-nowrap'
          title='Register Users'
          formatter={formatter}
          value={data?.register_status_user || 0}
        />
      </Card.Grid>

      <Card.Grid style={gridStyle}>
        <Statistic
          className='whitespace-normal lg:whitespace-nowrap'
          title='Login Users'
          formatter={formatter}
          value={data?.login_status_user || 0}
        />
      </Card.Grid>

      <Card.Grid style={gridStyle}>
        <Statistic
          className='whitespace-normal lg:whitespace-nowrap'
          title='Logout Users'
          formatter={formatter}
          value={data?.logout_status_user || 0}
        />
      </Card.Grid>

      <Card.Grid style={gridStyle}>
        <Statistic
          className='whitespace-normal lg:whitespace-nowrap'
          title='Blocked Users'
          formatter={formatter}
          value={data?.blocked_status_user || 0}
        />
      </Card.Grid>

      <Card.Grid style={gridStyle}>
        <Statistic
          className='whitespace-normal lg:whitespace-nowrap'
          title='Verified Users'
          formatter={formatter}
          value={data?.verified_user || 0}
        />
      </Card.Grid>
    </Card>
  );
}

export default UsersCard;

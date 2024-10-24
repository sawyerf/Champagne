import React from 'react';
import moment from 'moment';

const StatusIndicator = ({ service, status }) => {
  const getStatusInfo = (status) => {
    const loadedMatch = status.loaded.match(/loaded \((.*?)\)/);
    const activeMatch = status.active.match(/(active|inactive) \((.*?)\)(?: since (.*?);)?/);

    return {
      loadedStatus: loadedMatch ? loadedMatch[1] : 'Unknown',
      activeStatus: activeMatch ? activeMatch[2] : 'Unknown',
      activeDetail: activeMatch ? activeMatch[1] : 'Unknown',
      since: activeMatch && activeMatch[1] === 'active' ? activeMatch[3] : 'N/A',
      uptime: activeMatch && activeMatch[1] === 'active' ? status.active.split(';')[1].trim() : 'N/A'
    };
  }

  const convertDate = (date) => {
    if (date === 'N/A') return date;
    return moment(date).format('YYYY/MM/DD HH:mm');
  }

  const { activeStatus, since, uptime } = getStatusInfo(status);

  return (
    <div style={styles.mainStatus}>
      <h2 style={styles.serviceTitle}>{service}</h2>
      <div style={styles.status(activeStatus)}>{activeStatus.charAt(0).toUpperCase() + activeStatus.slice(1)}</div>
      <div style={styles.detail}> <strong>Since: </strong>{convertDate(since)}</div>
      <div style={styles.detail}> <strong>Uptime: </strong>{uptime ? uptime : 'N/A'} </div>
    </div>
  );
}

const styles = {
  serviceTitle: {
    color: 'white',
  },
  mainStatus: {
    display: 'flex',
    flexDirection: 'row',
    gap: '7px',
    alignItems: 'center',
  },
  status: (status) => ({
    backgroundColor: status === 'running' ? '#72c872' : '#d92222',
    borderRadius: '4px',
    padding: '4px',
    fontSize: '10px',
    width: 'min-content',
  }),
  detail: {
    color: 'lightgray',
    fontSize: '13px',
  }
}

export default StatusIndicator;
import React, { useState } from 'react';
import StatusIndicator from './StatusIndicator';
import DetailItem from './DetailItem';

const ServiceItem = ({ service, serviceStatus, openModal }) => {
  const [selected, setSelected] = useState(false);
  const [openDetails, setOpenDetails] = useState({});

  function toggleDetails(service) {
    setOpenDetails(prev => ({ ...prev, [service]: !prev[service] }));
  }

  return (
    <div key={service} style={styles.serviceMain(selected)} >
      <img src={`https://www.svgrepo.com/show/42661/server.svg`} alt={service} style={{ width: '50px', filter: 'invert(100%)' }} onClick={() => setSelected(!selected)} />
      <div style={styles.serviceLeft} onClick={() => setSelected(!selected)}>
        <StatusIndicator service={service} status={serviceStatus} />
        {openDetails[service] && (
          <div style={styles.details}>
            <DetailItem label="Main PID" value={serviceStatus.main_pid} />
            <DetailItem label="Tasks" value={serviceStatus.tasks} />
            <DetailItem label="CPU" value={serviceStatus.cpu} />
          </div>
        )}
      </div>
      <div style={styles.serviceRight}>
        <button style={styles.primaryButton} type="button" onClick={() => openModal(service)}>
          View Logs
        </button>
        <button style={{ ...styles.primaryButton, backgroundColor: '#57625a' }} type="button" onClick={() => toggleDetails(service)}>
          {openDetails[service] ? 'Show Less' : 'Show More'}
        </button>
      </div>
    </div>
  )
}

const styles = {
  serviceMain: (isSelected) => ({
    border: isSelected ? '1px solid #0086c9' : '1px solid #344054',
    borderRadius: '10px',
    padding: '10px',
    paddingLeft: '15px',
    display: 'flex',
    flexDirection: 'row',
    gap: '15px',
    cursor: 'pointer',
    flexWrap: 'wrap',
  }),
  serviceMainHover: {
  },
  details: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '3px',
  },
  serviceLeft: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  controlButtons: {
    display: 'flex',
    flexDirection: 'row',
    gap: '10px',
    justifyContent: 'center',
  },
  serviceRight: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  primaryButton: {
    backgroundColor: '#0086c9',
    border: 'none',
    borderRadius: '5px',
    color: 'white',
    fontSize: '14px',
    paddingTop: '5px',
    paddingBottom: '5px',
    paddingLeft: '20px',
    paddingRight: '20px',
  },
};

export default ServiceItem;
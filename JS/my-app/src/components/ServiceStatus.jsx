import React, { useState, useEffect } from 'react';
import StatusIndicator from './StatusIndicator';
import DetailItem from './DetailItem';
import { useCookies } from 'react-cookie';

// Mock data to simulate API responses
const mockData = {
  service1: {
    loaded: "loaded (loaded)",
    active: "active (running) since Mon 2023-09-11 10:00:00 UTC; 2 days ago",
    main_pid: "1234",
    tasks: "5",
    cpu: "2.5%",
    logs: [
      { time: "2023-09-11 10:00:00", message: "Service started" },
      { time: "2023-09-11 10:01:00", message: "Processing data" }
    ]
  },
  service2: {
    loaded: "loaded (loaded)",
    active: "active (running) since Mon 2023-09-11 11:00:00 UTC; 2 days ago",
    main_pid: "5678",
    tasks: "3",
    cpu: "1.5%",
    logs: [
      { time: "2023-09-11 11:00:00", message: "Service initialized" },
      { time: "2023-09-11 11:02:00", message: "Connecting to database" }
    ]
  }
};

function ServiceStatus() {
  const [status, setStatus] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [openDetails, setOpenDetails] = useState({});
  const [cookies] = useCookies(['user', 'firstName', 'lastName']);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchStatus();
    }, 10000);

    fetchStatus();

    return () => clearInterval(intervalId);
  }, []);

  function fetchStatus() {
    setStatus(mockData);
  }

  function controlService(action) {
    if (!["stop", "start", "restart", "emergency"].includes(action)) {
      console.log("bad action:")
      console.log(action)
      return;
    }
    console.log(action)

    const user = {
      first_name: cookies.firstName,
      last_name: cookies.lastName,
      email: cookies.user
    };

    if (action === "emergency") {
      console.log("Emergency stop initiated by", user);
    } else {
      // const form = document.querySelector('form');
      // const formData = new FormData(form);
      // const services = Array.from(formData.getAll('services'));
      // console.log(`${action} initiated for services:`, services, "by user:", user);
    }

    const newStatus = { ...status };
    Object.keys(newStatus).forEach(service => {
      if (action === "stop" || action === "emergency") {
        newStatus[service].active = "inactive (dead) since " + new Date().toUTCString() + ';';
      } else if (action === "start" || action === "restart") {
        newStatus[service].active = "active (running) since " + new Date().toUTCString() + ';';
      }
    });
    setStatus(newStatus);
  }

  function openModal(service) {
    setSelectedService(service);
    setShowModal(true);
  }

  function toggleDetails(service) {
    setOpenDetails(prev => ({ ...prev, [service]: !prev[service] }));
  }

  return (
    <>
      <h1 style={styles.title}>Service Status</h1>
      <div style={styles.services}>
        {Object.entries(status).map(([service, serviceStatus]) => (
          <div key={service} style={styles.serviceMain}>
            <img src={`https://www.svgrepo.com/show/42661/server.svg`} alt={service} style={{width: '50px', filter: 'invert(100%)'}} />
            <div style={styles.serviceLeft}>
              <StatusIndicator service={service} status={serviceStatus} />
              {openDetails[service] && (
                <div style={styles.details}>
                  <DetailItem label="Main PID" value={serviceStatus.main_pid} />
                  <DetailItem label="Tasks" value={serviceStatus.tasks} />
                  <DetailItem label="CPU" value={serviceStatus.cpu} />
                </div>
              )}
              <label>
                <input
                  type="checkbox"
                  name="services"
                  value={service}
                />
              </label>
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
        ))}

        <div style={styles.controlButtons}>
          <button style={{...styles.primaryButton, color: 'black', backgroundColor: 'lightgreen'}} type="button" onClick={() => controlService('start')}>Start Services</button>
          <button style={{...styles.primaryButton, color: 'black', backgroundColor: 'orange'}} type="button" onClick={() => controlService('restart')}>Restart Services</button>
          <button style={{...styles.primaryButton, color: 'black', backgroundColor: 'red'}} type="button" onClick={() => controlService('stop')}>Stop Services</button>
          <button style={{...styles.primaryButton, color: 'black', backgroundColor: 'red'}} type="button" onClick={() => controlService('emergency')}>Stop I/O</button>
        </div>
      </div>

      {showModal && (
        <div style={stylesLog.main}>
          <h2 style={stylesLog.title}>Logs for {selectedService}</h2>
          <button style={stylesLog.button} onClick={() => setShowModal(false)}>❌</button>
          <pre style={stylesLog.logs}>
            {selectedService && status[selectedService].logs.map((log, index) => (
              <div style={stylesLog.log} key={index}>{log.time} - {log.message}</div>
            ))}
          </pre>
        </div>
      )}
    </>
  );
}

const stylesLog = {
  main: {
    backgroundColor: '#181818',
    // padding: '20px',
    // borderRadius: '10px',
    margin: '10px',
    marginTop: '20px',
  },
  title: {
    color: 'white',
    fontSize: '20px',
  },
  button: {
    color: 'white',
    backgroundColor: 'transparent',
    border: 'none',
    position: 'relative',
    right: '20px',
    top: '20px',
  },
  logs: {
    color: 'white',
    padding: '20px',
    whiteSpace: 'pre-wrap',
  },
  log: {
    color: 'lightgray',
    fontSize: '13px',
  }
};

const styles = {
  title: {
    color: 'white',
    margin: '10px',
    fontSize: '24px',
  },
  services: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginRight: '10px',
    marginLeft: '10px',
  },
  serviceMain: {
    border: '1px solid #344054',
    borderRadius: '10px',
    padding: '10px',
    paddingLeft: '15px',
    display: 'flex',
    flexDirection: 'row',
    gap: '15px',
  },
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

export default ServiceStatus;
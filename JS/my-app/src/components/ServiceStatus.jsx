import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import ServiceItem from './ServiceItem';

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
      { time: "2023-09-11 11:00:00", message: "Service initialized" },
      { time: "2023-09-11 11:00:00", message: "Service initialized" },
      { time: "2023-09-11 11:00:00", message: "Service initialized" },
      { time: "2023-09-11 11:00:00", message: "Service initialized" },
      { time: "2023-09-11 11:00:00", message: "Service initialized" },
      { time: "2023-09-11 11:00:00", message: "Service initialized" },
      { time: "2023-09-11 11:00:00", message: "Service initialized" },
      { time: "2023-09-11 11:00:00", message: "Service initialized" },
      { time: "2023-09-11 11:00:00", message: "Service initialized" },
      { time: "2023-09-11 11:00:00", message: "Service initialized" },
      { time: "2023-09-11 11:00:00", message: "Service initialized" },
      { time: "2023-09-11 11:00:00", message: "Service initialized" },
      { time: "2023-09-11 11:00:00", message: "Service initialized" },
      { time: "2023-09-11 11:00:00", message: "Service initialized" },
      { time: "2023-09-11 11:00:00", message: "Service initialized" },
      { time: "2023-09-11 11:00:00", message: "Service initialized" },
      { time: "2023-09-11 11:00:00", message: "Service initialized" },
      { time: "2023-09-11 11:00:00", message: "Service initialized" },
      { time: "2023-09-11 11:00:00", message: "Service initialized" },
      { time: "2023-09-11 11:00:00", message: "Service initialized" },
      { time: "2023-09-11 11:00:00", message: "Service initialized" },
      { time: "2023-09-11 11:00:00", message: "Service initializedService initializedService initializedService initializedService initializedService initializedService initializedService initializedService initializedService initializedService initializedService initializedService initializedService initializedService initializedService initializedService initializedService initialized" },
      { time: "2023-09-11 11:00:00", message: "Service initialized" },
      { time: "2023-09-11 11:00:00", message: "Service initialized" },
      { time: "2023-09-11 11:00:00", message: "Service initialized" },
      { time: "2023-09-11 11:00:00", message: "Service initialized" },
      { time: "2023-09-11 11:02:00", message: "Connecting to database" }
    ]
  }
};

function ServiceStatus() {
  const [status, setStatus] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
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

  return (
    <>
      <h1 style={styles.title}>Service Status</h1>
      <div style={styles.services}>
        {Object.entries(status).map(([service, serviceStatus]) => (<ServiceItem key={service} service={service} serviceStatus={serviceStatus} openModal={openModal} />))}

        <div style={styles.controlButtons}>
          <button style={{ ...styles.primaryButton, color: 'black', backgroundColor: '#72c872' }} type="button" onClick={() => controlService('start')}>Start Services</button>
          <button style={{ ...styles.primaryButton, color: 'black', backgroundColor: 'orange' }} type="button" onClick={() => controlService('restart')}>Restart Services</button>
          <button style={{ ...styles.primaryButton, color: 'black', backgroundColor: '#d92222' }} type="button" onClick={() => controlService('stop')}>Stop Services</button>
          <button style={{ ...styles.primaryButton, color: 'black', backgroundColor: '#d92222' }} type="button" onClick={() => controlService('emergency')}>Stop I/O</button>
        </div>
      </div>

      {showModal && (
        <div style={stylesLog.main}>
          <button style={stylesLog.button} onClick={() => setShowModal(false)}>❌</button>
          <h2 style={stylesLog.title}>Logs for {selectedService}</h2>
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
    float: 'right',
    cursor: 'pointer',
  },
  logs: {
    marginTop: '10px',
    maxHeight: '300px',
    height: '100%',
    backgroundColor: '#1f1f1f',
    borderRadius: '5px',
    color: 'white',
    padding: '20px',
    whiteSpace: 'pre-wrap',
    overflowY: 'scroll',
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
  controlButtons: {
    display: 'flex',
    flexDirection: 'row',
    gap: '10px',
    justifyContent: 'center',
    flexWrap: 'wrap',
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
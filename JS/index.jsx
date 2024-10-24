import React, { useState, useEffect } from 'react';
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
            const form = document.querySelector('form');
            const formData = new FormData(form);
            const services = Array.from(formData.getAll('services'));
            console.log(`${action} initiated for services:`, services, "by user:", user);
        }

        const newStatus = { ...status };
        Object.keys(newStatus).forEach(service => {
            if (action === "stop" || action === "emergency") {
                newStatus[service].active = "inactive (dead) since " + new Date().toUTCString();
            } else if (action === "start" || action === "restart") {
                newStatus[service].active = "active (running) since " + new Date().toUTCString();
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

    function getStatusInfo(status) {
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

    function StatusIndicator({ status }) {
        const { activeStatus, since, uptime } = getStatusInfo(status);

        return (
            <div>
                <div>{activeStatus.charAt(0).toUpperCase() + activeStatus.slice(1)}</div>
                <div>
                    Since: {since} | Uptime: {uptime}
                </div>
            </div>
        );
    }

    function DetailItem({ label, value }) {
        return (
            <div>
                <span>{label}:</span>
                <span>{value}</span>
            </div>
        );
    }

    return (
        <div>
            <h1>Service Status</h1>
            <form onSubmit={(e) => { e.preventDefault(); controlService('stop'); }}>
                {Object.entries(status).map(([service, serviceStatus]) => (
                    <div key={service}>
                        <h2>{service}</h2>
                        <button type="button" onClick={() => openModal(service)}>
                            View Logs
                        </button>
                        <StatusIndicator status={serviceStatus} />
                        <button type="button" onClick={() => toggleDetails(service)}>
                            {openDetails[service] ? 'Show Less' : 'Show More'}
                        </button>
                        {openDetails[service] && (
                            <div>
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
                            Select {service}
                        </label>
                    </div>
                ))}
                <div>
                    <button type="button" onClick={() => controlService('start')}>Start Services</button>
                    <button type="button" onClick={() => controlService('restart')}>Restart Services</button>
                    <button type="submit">Stop Services</button>
                    <button type="button" onClick={() => controlService('emergency')}>Stop I/O</button>
                </div>
            </form>

            {showModal && (
                <div>
                    <h2>Logs for {selectedService}</h2>
                    <button onClick={() => setShowModal(false)}>Close</button>
                    <pre>
                        {selectedService && status[selectedService].logs.map((log, index) => (
                            <div key={index}>{log.time} - {log.message}</div>
                        ))}
                    </pre>
                </div>
            )}
        </div>
    );
}

export default ServiceStatus;
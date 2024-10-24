import ServiceStatus from './components/ServiceStatus';

function App() {
  return (
    <div style={styles.body}>
      <div style={styles.main}>
        <ServiceStatus />
      </div>
    </div>
  );
}

const styles = {
  body: {
    backgroundColor: '#181818',
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  main: {
    width: '100%',
    maxWidth: '800px',
  }
}

export default App;
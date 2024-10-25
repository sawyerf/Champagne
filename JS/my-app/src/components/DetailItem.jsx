import React from 'react';

const DetailItem = ({ label, value }) => {
  return (
    <div>
      <span style={styles.detail}><strong>{label}:</strong></span>
      <span style={styles.detail}>{value}</span>
    </div>
  );
}

const styles = {
  detail: {
    color: 'white',
    fontSize: '13px',
  }
}
export default DetailItem;
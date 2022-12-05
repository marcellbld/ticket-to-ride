import { motion } from "framer-motion";

function NotificationModal({ message }) {
  return (
    <>
      <motion.div
        className="position-absolute"
        style={{
          backgroundColor: "#00000088",
          top: "50%",
          left: "50%",
          zIndex: 999,
          opacity: 0,
          transform: 'translate(-50%, -50%)',
          padding: '1rem',
          border: 'white solid 0.1rem',
          borderRadius: '0.75rem',
        }}
        animate={{
          opacity: 1
        }}
      >
        {message}
      </motion.div>
    </>
  );
}

export default NotificationModal;

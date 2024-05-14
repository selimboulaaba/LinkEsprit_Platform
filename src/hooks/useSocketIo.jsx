import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';

const useSocketIo = () => {
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    const api = "http://localhost:3000"
    const connect = io(api);
    setSocket(connect);
  }, []);
  return { socket };
};

export default useSocketIo;
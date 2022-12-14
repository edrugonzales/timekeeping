import React from 'react'
import io from 'socket.io-client'

const SocketContext = React.createContext()

const SocketProvider = ({children}) => {
  const ENDPOINT = process.env.REACT_APP_SOCKET_URL
  const socket = io(ENDPOINT, {transports: ['websocket', 'polling']})
  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
}

export {SocketContext, SocketProvider}

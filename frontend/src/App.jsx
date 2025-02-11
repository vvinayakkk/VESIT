import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import DeliveryTracker from './components/DeliveryTracker'
import 'mapbox-gl/dist/mapbox-gl.css'
import './styles/DeliveryTracker.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes>
      <Route path="/" element={<h1>Home</h1>} />
      <Route path="/map" element={<DeliveryTracker deliveryId="your-delivery-id" />} />
    </Routes>
  )
}

export default App

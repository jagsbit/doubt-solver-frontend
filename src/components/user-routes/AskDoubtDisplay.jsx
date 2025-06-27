import React from 'react'
import AskDoubt from '../AskDoubt'
import Pricing from '../Pricing'
import { getUser } from '../../auth'

const AskDoubtDisplay = () => {
  const user=getUser();
  return (
      user?.role==='pro'?<AskDoubt/>:<Pricing/>
  )
}

export default AskDoubtDisplay


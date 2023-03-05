import { useEffect } from 'react'
import {useParams} from "react-router-dom"
import {useDispatch} from "react-redux"
import { getProductDetails } from '../rtk-slice/productSlice'

const ProductDetails = () => {
  const {id} = useParams()
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getProductDetails(id))
  }, [id])
  
  return (
    <div>ProductDetails {id} </div>
  )
}

export default ProductDetails
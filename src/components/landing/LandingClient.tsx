'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'

const OrderPopup = dynamic(() => import('@/components/landing/OrderPopup'), {
    ssr: false,
})

interface OrderItem {
    type: 'PRODUCT' | 'PACKAGE'
    id: string
    name: string
    price: number
    duration?: number
}

interface LandingClientProps {
    children: (props: {
        handleProductOrder: (productId: string, duration: number) => void
        handlePackageOrder: (packageId: string) => void
    }) => React.ReactNode
}

export default function LandingClient({ children }: LandingClientProps) {
    const [orderItem, setOrderItem] = useState<OrderItem | null>(null)
    const [isOrderPopupOpen, setIsOrderPopupOpen] = useState(false)

    const handleProductOrder = (productId: string, duration: number) => {
        fetch(`/api/products/${productId}`)
            .then(res => res.json())
            .then(data => {
                const dailyPrice = data.product.monthlyPrice / 30
                setOrderItem({
                    type: 'PRODUCT',
                    id: productId,
                    name: data.product.name,
                    price: dailyPrice * duration,
                    duration,
                })
                setIsOrderPopupOpen(true)
            })
            .catch(error => {
                console.error('Failed to fetch product:', error)
            })
    }

    const handlePackageOrder = (packageId: string) => {
        fetch(`/api/packages/${packageId}`)
            .then(res => res.json())
            .then(data => {
                setOrderItem({
                    type: 'PACKAGE',
                    id: packageId,
                    name: data.package.name,
                    price: data.package.price,
                    duration: data.package.duration,
                })
                setIsOrderPopupOpen(true)
            })
            .catch(error => {
                console.error('Failed to fetch package:', error)
            })
    }

    const handleCloseOrderPopup = () => {
        setIsOrderPopupOpen(false)
        setOrderItem(null)
    }

    return (
        <>
            {children({ handleProductOrder, handlePackageOrder })}
            {isOrderPopupOpen && orderItem && (
                <OrderPopup
                    isOpen={isOrderPopupOpen}
                    onClose={handleCloseOrderPopup}
                    item={orderItem}
                />
            )}
        </>
    )
}

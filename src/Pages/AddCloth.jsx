import React from 'react'
import AddClothForm from '../components/Cloth/AddClothForm'

const AddCloth = () => {
  return (
    <div>
        <h1 className="text-2xl text-center kanit md:text-3xl text-color-primary mb-4">
            Add Clothes
          </h1>
          <div className="w-full h-0.5 bg-[color:var(--text-color-primary)] mb-4"></div>
          <AddClothForm />


         
    </div>
  )
}

export default AddCloth
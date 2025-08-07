import React, { useState } from 'react'

interface CustomProgressBarProps {
    totalSteps: number
    currentStep: number
    onStepClick: (step: number) => void
}

const CustomProgressBar: React.FC<CustomProgressBarProps> = ({
    totalSteps,
    currentStep,
    onStepClick,
}) => {
    return (
        <div className="w-full max-w-md mx-auto">
            <div className="flex justify-between items-center">
                
                {Array.from({ length: totalSteps }, (_, index) => (
                    <div key={index} className="flex-1 flex items-center">
                        <button
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors duration-200 ${index + 1 <= currentStep
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-600'
                                }`}
                            onClick={() => onStepClick(index + 1)}
                        >
                            {index + 1}
                        </button>
                        {index < totalSteps - 1 && (
                            <div
                                className={`flex-1 h-1 mx-2 transition-colors duration-200 ${index + 1 < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                                    }`}
                            ></div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

// Example usage
const ProgressBarExample: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(1)

    const handleStepClick = (step: number) => {
        setCurrentStep(step)
    }

    return (
        <div className="p-4">
            <CustomProgressBar
                totalSteps={3}
                currentStep={currentStep}
                onStepClick={handleStepClick}
            />
            <div className="mt-4 flex justify-between">
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                    onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 1))

                        
                    }
                >
                    Previous
                </button>
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                    onClick={() => setCurrentStep((prev) => Math.min(prev + 1, 3))}
                >
                    Next
                </button>
            </div>
        </div>
    )
}

export default ProgressBarExample
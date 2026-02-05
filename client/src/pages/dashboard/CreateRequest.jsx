import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { recipientService } from '../../services/recipient.service'
import { handleApiError, handleApiSuccess } from '../../utils/errorHandler'
import { Heart, Save, ArrowLeft } from 'lucide-react'

function CreateRequest() {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const onSubmit = async (data) => {
    try {
      setIsLoading(true)
      await recipientService.createRequest(data)
      handleApiSuccess('Blood request created successfully!')
      navigate('/dashboard/my-requests')
    } catch (error) {
      handleApiError(error, 'Failed to create blood request')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="create-request-page">
      <div className="create-request-container">
        {/* Header */}
        <div className="create-request-header">
          <button
            onClick={() => navigate('/dashboard/requests')}
            className="create-request-back-btn"
          >
            <ArrowLeft className="create-request-back-icon" />
            Back to Requests
          </button>
          <h1 className="create-request-title">Create Blood Request</h1>
          <p className="create-request-subtitle">Submit a request for blood donation</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="create-request-form">
          {/* Patient Information */}
          <div className="create-request-section">
            <div className="create-request-section-header">
              <h2 className="create-request-section-title">Patient Information</h2>
            </div>
            <div className="create-request-section-body">
              <div>
                <label className="form-label">Patient Name *</label>
                <input
                  {...register('patientName', { required: 'Patient name is required' })}
                  type="text"
                  className={`form-input ${errors.patientName ? 'form-input-error' : ''}`}
                  placeholder="Enter patient's full name"
                />
                {errors.patientName && (
                  <p className="form-error">{errors.patientName.message}</p>
                )}
              </div>

              <div className="create-request-grid">
                <div>
                  <label className="form-label">Blood Group Required *</label>
                  <select
                    {...register('bloodGroup', { required: 'Blood group is required' })}
                    className={`form-select ${errors.bloodGroup ? 'form-input-error' : ''}`}
                  >
                    <option value="">Select blood group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                  {errors.bloodGroup && (
                    <p className="form-error">{errors.bloodGroup.message}</p>
                  )}
                </div>

                <div>
                  <label className="form-label">Units Required *</label>
                  <select
                    {...register('unitsRequired', { required: 'Units required is required' })}
                    className={`form-select ${errors.unitsRequired ? 'form-input-error' : ''}`}
                  >
                    <option value="">Select units</option>
                    <option value="1">1 Unit</option>
                    <option value="2">2 Units</option>
                    <option value="3">3 Units</option>
                    <option value="4">4 Units</option>
                    <option value="5">5 Units</option>
                  </select>
                  {errors.unitsRequired && (
                    <p className="form-error">{errors.unitsRequired.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="form-label">Urgency Level *</label>
                <select
                  {...register('urgency', { required: 'Urgency level is required' })}
                  className={`form-select ${errors.urgency ? 'form-input-error' : ''}`}
                >
                  <option value="">Select urgency</option>
                  <option value="low">Low - Can wait a few days</option>
                  <option value="medium">Medium - Needed within 24-48 hours</option>
                  <option value="high">High - Needed within 12-24 hours</option>
                  <option value="critical">Critical - Needed immediately</option>
                </select>
                {errors.urgency && (
                  <p className="form-error">{errors.urgency.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Hospital Information */}
          <div className="create-request-section">
            <div className="create-request-section-header">
              <h2 className="create-request-section-title">Hospital Information</h2>
            </div>
            <div className="create-request-section-body">
              <div>
                <label className="form-label">Hospital Name *</label>
                <input
                  {...register('hospitalName', { required: 'Hospital name is required' })}
                  type="text"
                  className={`form-input ${errors.hospitalName ? 'form-input-error' : ''}`}
                  placeholder="Enter hospital name"
                />
                {errors.hospitalName && (
                  <p className="form-error">{errors.hospitalName.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">Hospital Address *</label>
                <textarea
                  {...register('hospitalAddress', { required: 'Hospital address is required' })}
                  className={`form-textarea ${errors.hospitalAddress ? 'form-input-error' : ''}`}
                  placeholder="Enter complete hospital address"
                />
                {errors.hospitalAddress && (
                  <p className="form-error">{errors.hospitalAddress.message}</p>
                )}
              </div>

              <div className="create-request-grid-3">
                <div>
                  <label className="form-label">City *</label>
                  <input
                    {...register('city', { required: 'City is required' })}
                    type="text"
                    className={`form-input ${errors.city ? 'form-input-error' : ''}`}
                    placeholder="Enter city"
                  />
                  {errors.city && (
                    <p className="form-error">{errors.city.message}</p>
                  )}
                </div>

                <div>
                  <label className="form-label">State *</label>
                  <input
                    {...register('state', { required: 'State is required' })}
                    type="text"
                    className={`form-input ${errors.state ? 'form-input-error' : ''}`}
                    placeholder="Enter state"
                  />
                  {errors.state && (
                    <p className="form-error">{errors.state.message}</p>
                  )}
                </div>

                <div>
                  <label className="form-label">Pincode *</label>
                  <input
                    {...register('pincode', {
                      required: 'Pincode is required',
                      pattern: {
                        value: /^[0-9]{6}$/,
                        message: 'Please enter a valid 6-digit pincode'
                      }
                    })}
                    type="text"
                    className={`form-input ${errors.pincode ? 'form-input-error' : ''}`}
                    placeholder="Enter pincode"
                  />
                  {errors.pincode && (
                    <p className="form-error">{errors.pincode.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="create-request-section">
            <div className="create-request-section-header">
              <h2 className="create-request-section-title">Contact Information</h2>
            </div>
            <div className="create-request-section-body">
              <div className="create-request-grid">
                <div>
                  <label className="form-label">Contact Person Name *</label>
                  <input
                    {...register('contactPerson.name', { required: 'Contact person name is required' })}
                    type="text"
                    className={`form-input ${errors.contactPerson?.name ? 'form-input-error' : ''}`}
                    placeholder="Enter contact person name"
                  />
                  {errors.contactPerson?.name && (
                    <p className="form-error">{errors.contactPerson.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="form-label">Phone Number *</label>
                  <input
                    {...register('contactPerson.phone', {
                      required: 'Phone number is required',
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: 'Please enter a valid 10-digit phone number'
                      }
                    })}
                    type="tel"
                    className={`form-input ${errors.contactPerson?.phone ? 'form-input-error' : ''}`}
                    placeholder="Enter phone number"
                  />
                  {errors.contactPerson?.phone && (
                    <p className="form-error">{errors.contactPerson.phone.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="form-label">Relationship to Patient *</label>
                <input
                  {...register('contactPerson.relationship', { required: 'Relationship is required' })}
                  type="text"
                  className={`form-input ${errors.contactPerson?.relationship ? 'form-input-error' : ''}`}
                  placeholder="e.g., Son, Daughter, Spouse, Friend"
                />
                {errors.contactPerson?.relationship && (
                  <p className="form-error">{errors.contactPerson.relationship.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="create-request-section">
            <div className="create-request-section-header">
              <h2 className="create-request-section-title">Additional Information</h2>
            </div>
            <div className="create-request-section-body">
              <div>
                <label className="form-label">Required Date *</label>
                <input
                  {...register('requiredDate', { required: 'Required date is required' })}
                  type="datetime-local"
                  className={`form-input ${errors.requiredDate ? 'form-input-error' : ''}`}
                />
                {errors.requiredDate && (
                  <p className="form-error">{errors.requiredDate.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">Description (Optional)</label>
                <textarea
                  {...register('description')}
                  className="form-textarea"
                  placeholder="Any additional information about the patient or situation"
                  rows={4}
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="create-request-actions">
            <button
              type="button"
              onClick={() => navigate('/dashboard/requests')}
              className="btn btn-secondary create-request-cancel-btn"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary create-request-submit-btn"
            >
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  Creating Request...
                </>
              ) : (
                <>
                  <Heart className="w-5 h-5" />
                  Create Request
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateRequest

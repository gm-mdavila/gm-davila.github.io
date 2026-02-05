"use client";

import { useState } from "react";

export default function PaymentModal({ isOpen, closeModal, amount }) {
	const [formData, setFormData] = useState({
		cardNumber: "",
		cardName: "",
		expiryDate: "",
		cvv: "",
	});
	const [processing, setProcessing] = useState(false);
	const [errors, setErrors] = useState({});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const validateForm = () => {
		const newErrors = {};

		if (!formData.cardNumber.match(/^\d{16}$/)) {
			newErrors.cardNumber = "Please enter a valid 16-digit card number";
		}

		if (!formData.cardName.trim()) {
			newErrors.cardName = "Please enter the name on the card";
		}

		if (!formData.expiryDate.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
			newErrors.expiryDate = "Please enter expiry date in MM/YY format";
		}

		if (!formData.cvv.match(/^\d{3,4}$/)) {
			newErrors.cvv = "Please enter a valid CVV";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		setProcessing(true);

		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 2000));

			// Call payment API
			const response = await fetch("/api/payment", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					...formData,
					amount: parseFloat(amount),
				}),
			});

			const result = await response.json();

			if (result.success) {
				alert("Payment successful! Thank you for your purchase.");
				closeModal();
				// Clear cart and redirect here if needed
			} else {
				alert("Payment failed: " + result.message);
			}
		} catch (error) {
			alert("Payment error. Please try again.");
			console.error("Payment error:", error);
		} finally {
			setProcessing(false);
		}
	};

	if (!isOpen) return null;

	return (
		<div className={`payment-modal ${isOpen ? "active" : ""}`}>
			<div className="payment-form-container">
				<div className="payment-header">
					<h2>Secure Payment</h2>
					<button className="close-payment" onClick={closeModal}>
						<i className="fas fa-times"></i>
					</button>
				</div>

				<div className="payment-body">
					<div className="payment-amount">Total: ${amount}</div>

					<form onSubmit={handleSubmit}>
						<div className="form-group">
							<label className="form-label">Card Number</label>
							<input type="text" name="cardNumber" className={`form-input ${errors.cardNumber ? "error" : ""}`} placeholder="1234 5678 9012 3456" value={formData.cardNumber} onChange={handleChange} maxLength="16" />
							{errors.cardNumber && <div className="error-message visible">{errors.cardNumber}</div>}
						</div>

						<div className="form-group">
							<label className="form-label">Cardholder Name</label>
							<input type="text" name="cardName" className={`form-input ${errors.cardName ? "error" : ""}`} placeholder="John Doe" value={formData.cardName} onChange={handleChange} />
							{errors.cardName && <div className="error-message visible">{errors.cardName}</div>}
						</div>

						<div className="form-row">
							<div className="form-col">
								<div className="form-group">
									<label className="form-label">Expiry Date</label>
									<input type="text" name="expiryDate" className={`form-input ${errors.expiryDate ? "error" : ""}`} placeholder="MM/YY" value={formData.expiryDate} onChange={handleChange} maxLength="5" />
									{errors.expiryDate && <div className="error-message visible">{errors.expiryDate}</div>}
								</div>
							</div>

							<div className="form-col">
								<div className="form-group">
									<label className="form-label">CVV</label>
									<input type="password" name="cvv" className={`form-input ${errors.cvv ? "error" : ""}`} placeholder="123" value={formData.cvv} onChange={handleChange} maxLength="4" />
									{errors.cvv && <div className="error-message visible">{errors.cvv}</div>}
								</div>
							</div>
						</div>

						<div className="card-icons">
							<div className="card-icon">VISA</div>
							<div className="card-icon">MC</div>
							<div className="card-icon">AMEX</div>
							<div className="card-icon">DISC</div>
						</div>

						<button type="submit" className="payment-submit-btn" disabled={processing}>
							{processing ? "Processing..." : `Pay $${amount}`}
						</button>
					</form>

					<div className="payment-security-note">
						<i className="fas fa-shield-alt"></i>
						<span>Your payment is secured with 256-bit SSL encryption</span>
					</div>

					{processing && (
						<div className="processing-overlay active">
							<div className="spinner"></div>
							<p>Processing your payment...</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

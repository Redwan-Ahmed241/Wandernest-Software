"use client"

import { type FunctionComponent, useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import styles from "../Styles/Destinations.module.css"
import Layout from "../App/Layout"
import { getDestinations } from "../App/api-services"

const incrementDestinationClick = async (id: number) => {
	try {
		await fetch(`https://wander-nest-ad3s.onrender.com/api/home/destinations/${id}/click/`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
		})
	} catch (err) {
		console.error("Failed to increment click:", err)
	}
}

const Destinations: FunctionComponent = () => {
	const navigate = useNavigate()
	const [destinations, setDestinations] = useState<any[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState("")

	const _onHomeClick = useCallback(() => {
		navigate("/")
	}, [navigate])

	useEffect(() => {
		const fetchDestinations = async () => {
			setLoading(true)
			setError("")
			try {
				const data = await getDestinations()
				setDestinations(Array.isArray(data) ? data : [])
			} catch (err) {
				setError("Failed to fetch destinations")
				setDestinations([])
			} finally {
				setLoading(false)
			}
		}
		fetchDestinations()
	}, [])

	return (
		<Layout>
			<div className={styles.destinations}>
				{/* Hero Section */}
				<div className={styles.heroSection}>
					<div className={styles.heroContent}>
						<h1 className={styles.heroTitle}>Discover Top Destinations in Bangladesh</h1>
						<p className={styles.heroSubtitle}>Travel far, travel wide</p>
					</div>
				</div>

				{/* Main Content */}
				<div className={styles.mainContent}>
					<div className={styles.sectionHeader}>
						<h2 className={styles.sectionTitle}>Explore Destinations</h2>
					</div>

					{/* Destinations Grid */}
					<div className={styles.destinationsContainer}>
						{loading && <div className={styles.loadingState}>Loading destinations...</div>}

						{error && <div className={styles.errorState}>{error}</div>}

						{!loading && !error && (
							<div className={styles.destinationsGrid}>
								{destinations.map((dest, idx) => (
									<div
										className={styles.destinationCard}
										key={dest.id || idx}
										onClick={async () => {
											await incrementDestinationClick(dest.id)
											navigate(`/destination-01`)
										}}
									>
										<div className={styles.cardImageContainer}>
											<img
												className={styles.cardImage}
												alt={dest.name || dest.title}
												src={dest.image_url || "/placeholder.svg"}
												onError={(e) => {
													e.currentTarget.src = "/placeholder-image.jpg"
												}}
											/>
										</div>
										<div className={styles.cardContent}>
											<h3 className={styles.cardTitle}>{dest.name || dest.title}</h3>
											<p className={styles.cardDescription}>{dest.subtitle || dest.description}</p>
										</div>
									</div>
								))}
							</div>
						)}
					</div>

					{/* Call to Action Section */}
				
				</div>
			</div>
		</Layout>
	)
}

export default Destinations

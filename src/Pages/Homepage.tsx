/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { API_BASE } from '../config/api';
import {
    type FunctionComponent,
    useEffect,
    useState,
    useCallback,
    useMemo,
} from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout";
import OptimizedImage from "../components/optimizedimages";
import { ArrowRight, MapPin, Star, Shield, Clock } from "react-feather";
import { getDestinations } from "../App/api-services";

const HomePage: FunctionComponent = () => {
    const [destinations, setDestinations] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const fetchDestinations = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const data = await getDestinations();
            const sorted = (Array.isArray(data) ? data : [])
                .sort((a, b) => (b.click || 0) - (a.click || 0))
                .slice(0, 6);
            setDestinations(sorted);
        } catch (err: any) {
            setError(err.message || "Error fetching destinations");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDestinations();
    }, [fetchDestinations]);

    const incrementDestinationClick = useCallback(async (id: number) => {
        try {
            await fetch(
                `${API_BASE}/api/home/destinations/${id}/click/`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                }
            );
        } catch (err) {
            // Optionally handle error
        }
    }, []);

    const handleCardClick = useCallback(
        async (dest: any) => {
            await incrementDestinationClick(dest.id);
            navigate(`/destination/${dest.id}`);
        },
        [incrementDestinationClick, navigate]
    );

    const services = useMemo(
        () => [
            {
                icon: <Shield className="w-8 h-8" />,
                title: "Visa Assistance",
                description: "Fast and reliable visa processing with expert guidance",
                color: "from-blue-500 to-blue-600",
                path: "/visa-assistance",
            },
            {
                icon: <MapPin className="w-8 h-8" />,
                title: "Travel Planner",
                description: "Customize your perfect trip with our AI-powered planner",
                color: "from-green-500 to-green-600",
                path: "/plan-a-trip",
            },
            {
                icon: <Clock className="w-8 h-8" />,
                title: "24/7 Support",
                description: "Round-the-clock assistance during your travels",
                color: "from-purple-500 to-purple-600",
                path: "/support",
            },
        ],
        []
    );

    const stats = useMemo(
        () => [
            { number: "50K+", label: "Happy Travelers", icon: "👥" },
            { number: "200+", label: "Destinations", icon: "🗺️" },
            { number: "1000+", label: "Hotels", icon: "🏨" },
            { number: "4.9", label: "Average Rating", icon: "⭐" },
        ],
        []
    );

    return (
        <Layout>
            <main className="min-h-screen bg-gradient-to-b from-white via-gray-50/30 to-white">
                {/* Hero Section - Premium Design */}
                <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
                    <div
                        className="absolute inset-0 w-full h-full bg-cover bg-center"
                        style={{
                            backgroundImage: "url('/Figma_photos/2102331.jpg')",
                            backgroundPosition: "center",
                        }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-[#0d1c1c]/80 via-[#4a6b5b]/60 to-[#0d1c1c]/80"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    </div>

                    <div className="hidden lg:block absolute top-20 left-20 w-24 h-24 bg-[#6ab187]/20 rounded-full blur-2xl animate-pulse"></div>
                    <div className="hidden lg:block absolute top-40 right-32 w-32 h-32 bg-[#abb79a]/20 rounded-full blur-2xl animate-pulse"></div>
                    <div className="hidden lg:block absolute bottom-32 left-40 w-28 h-28 bg-[#6ab187]/20 rounded-full blur-2xl animate-pulse"></div>

                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="mb-6 inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2">
                            <span className="text-[#6ab187] text-lg">✨</span>
                            <span className="text-white/90 text-sm font-semibold">Discover Bangladesh's Hidden Gems</span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-white drop-shadow-2xl">
                            Explore Bangladesh with
                            <span className="block mt-2 bg-gradient-to-r from-[#6ab187] via-[#abb79a] to-[#6ab187] bg-clip-text text-transparent">
                                WanderNest
                            </span>
                        </h1>

                        <p className="text-lg sm:text-xl md:text-2xl mb-10 text-white/95 max-w-3xl mx-auto leading-relaxed font-light">
                            Discover the beauty, culture, and adventure of Bangladesh with our expertly crafted travel experiences
                        </p>

                        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full">
                            <button
                                onClick={() => navigate("/packages")}
                                className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#6ab187] to-[#4a6b5b] text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-[#6ab187]/50 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-3 min-w-[220px]"
                            >
                                Start Your Journey
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                            </button>
                            <button
                                onClick={() => navigate("/destinations")}
                                className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white font-bold text-lg rounded-2xl transition-all duration-300 hover:scale-105 hover:bg-white/20 hover:border-white/50 active:scale-95 min-w-[220px]"
                            >
                                Explore Destinations
                            </button>
                        </div>

                        <div className="mt-12 flex flex-wrap justify-center items-center gap-6 text-white/80 text-sm">
                            <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4 text-[#6ab187]" />
                                <span>Verified Tours</span>
                            </div>
                            <div className="w-1 h-1 bg-white/40 rounded-full"></div>
                            <div className="flex items-center gap-2">
                                <Star className="w-4 h-4 text-[#6ab187] fill-current" />
                                <span>4.9/5 Rating</span>
                            </div>
                            <div className="w-1 h-1 bg-white/40 rounded-full"></div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-[#6ab187]" />
                                <span>24/7 Support</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute top-0 left-0 w-72 h-72 bg-[#6ab187] rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#4a6b5b] rounded-full blur-3xl"></div>
                    </div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {stats.map((stat, index) => (
                                <div key={index} className="group text-center">
                                    <div className="relative mb-6">
                                        <div className="absolute inset-0 bg-[#4a6b5b] rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-all duration-500"></div>
                                        <div className="relative w-20 h-20 bg-[#4a6b5b] rounded-3xl flex items-center justify-center mx-auto shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                                            <span className="text-3xl">{stat.icon}</span>
                                        </div>
                                    </div>
                                    <div className="text-4xl md:text-5xl font-extrabold bg-gradient-to-br from-[#4a6b5b] to-[#6ab187] bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">
                                        {stat.number}
                                    </div>
                                    <div className="text-gray-600 font-semibold text-sm md:text-base">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Featured Destinations */}
                <section className="py-24 bg-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#6ab187]/5 to-transparent rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#4a6b5b]/5 to-transparent rounded-full blur-3xl"></div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#6ab187]/10 to-[#4a6b5b]/10 rounded-full px-5 py-2 mb-6">
                                <MapPin className="w-4 h-4 text-[#6ab187]" />
                                <span className="text-[#4a6b5b] text-sm font-bold uppercase tracking-wider">Popular Picks</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                                Featured <span className="bg-gradient-to-r from-[#6ab187] to-[#4a6b5b] bg-clip-text text-transparent">Destinations</span>
                            </h2>
                            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                                Explore Bangladesh's most visited destinations - curated based on traveler interest and popularity
                            </p>
                        </div>

                        {error && (
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center px-6 py-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl shadow-sm">
                                    <span className="mr-2">⚠️</span>
                                    {error}
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {loading
                                ? Array.from({ length: 6 }).map((_, index) => (
                                    <div
                                        key={index}
                                        className="bg-gray-100 rounded-3xl overflow-hidden animate-pulse"
                                    >
                                        <div className="h-72 bg-gray-200"></div>
                                        <div className="p-6 space-y-3">
                                            <div className="h-7 bg-gray-200 rounded-lg"></div>
                                            <div className="h-5 bg-gray-200 rounded-lg w-3/4"></div>
                                            <div className="h-4 bg-gray-200 rounded-lg w-1/2"></div>
                                        </div>
                                    </div>
                                ))
                                : destinations.map((place, index) => (
                                    <div
                                        key={place.id || index}
                                        className="group bg-white rounded-3xl shadow-xl overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border border-gray-100"
                                        onClick={() => handleCardClick(place)}
                                    >
                                        <div className="relative overflow-hidden h-72">
                                            <OptimizedImage
                                                src={
                                                    place.image_url ||
                                                    "https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=600"
                                                }
                                                webpSrc={
                                                    place.image_url ||
                                                    "https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=600&format=webp"
                                                }
                                                alt={place.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                loading="lazy"
                                                decoding="async"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>

                                            <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                                                <div className="bg-gradient-to-r from-[#6ab187] to-[#4a6b5b] backdrop-blur-md rounded-full px-4 py-1.5 flex items-center gap-1.5 shadow-lg">
                                                    <span className="text-sm font-bold text-white">🔥 Popular</span>
                                                </div>
                                                <div className="bg-white/95 backdrop-blur-md rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-lg">
                                                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                                    <span className="text-sm font-bold text-gray-900">4.8</span>
                                                </div>
                                            </div>

                                            <div className="absolute bottom-4 left-4 right-4 transform translate-y-6 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                                                <div className="flex items-center justify-between text-white">
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="w-4 h-4" />
                                                        <span className="text-sm font-semibold">Bangladesh</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-3 py-1.5">
                                                        <span className="text-sm font-bold">View Details</span>
                                                        <ArrowRight className="w-4 h-4" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-6">
                                            <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#6ab187] transition-colors duration-300">
                                                {place.name}
                                            </h3>
                                            <p className="text-gray-600 line-clamp-2 leading-relaxed mb-4">
                                                {place.description ||
                                                    "Experience the beauty and culture of this amazing destination"}
                                            </p>

                                            {place.click && (
                                                <div className="pt-4 border-t border-gray-100">
                                                    <div className="flex items-center justify-between text-sm">
                                                        <div className="flex items-center gap-2 text-gray-500">
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                            </svg>
                                                            <span className="font-semibold">{place.click.toLocaleString()} views</span>
                                                        </div>
                                                        <div className="text-[#6ab187] font-bold group-hover:gap-2 flex items-center gap-1 transition-all duration-300">
                                                            <span>Explore</span>
                                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                        </div>

                        {!loading && destinations.length > 0 && (
                            <div className="text-center mt-16">
                                <button
                                    onClick={() => navigate("/destinations")}
                                    className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-[#6ab187] to-[#4a6b5b] text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-[#6ab187]/50 transition-all duration-300 hover:scale-105 active:scale-95"
                                >
                                    <span>View All Destinations</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                                </button>
                            </div>
                        )}

                        {!loading && destinations.length === 0 && !error && (
                            <div className="text-center py-20">
                                <div className="w-28 h-28 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                                    <MapPin className="w-14 h-14 text-gray-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                    No destinations found
                                </h3>
                                <p className="text-gray-600 text-lg">
                                    Check back later for amazing destinations
                                </p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Services Section */}
                <section className="py-24 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-[#6ab187] rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#4a6b5b] rounded-full blur-3xl"></div>
                    </div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#6ab187]/10 to-[#4a6b5b]/10 rounded-full px-5 py-2 mb-6">
                                <Shield className="w-4 h-4 text-[#6ab187]" />
                                <span className="text-[#4a6b5b] text-sm font-bold uppercase tracking-wider">What We Offer</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                                Our <span className="bg-gradient-to-r from-[#6ab187] to-[#4a6b5b] bg-clip-text text-transparent">Services</span>
                            </h2>
                            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                                Everything you need for the perfect travel experience
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {services.map((service, index) => (
                                <div
                                    key={index}
                                    className="group bg-white rounded-3xl shadow-xl p-10 cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border border-gray-100"
                                    onClick={() => navigate(service.path)}
                                >
                                    <div className="relative mb-8">
                                        <div className={`absolute inset-0 bg-gradient-to-br ${service.color} rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-all duration-500`}></div>
                                        <div className={`relative w-20 h-20 bg-gradient-to-br ${service.color} rounded-3xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 text-white`}>
                                            {service.icon}
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#6ab187] transition-colors duration-300">
                                        {service.title}
                                    </h3>
                                    <p className="text-gray-600 mb-6 leading-relaxed text-base">
                                        {service.description}
                                    </p>
                                    <div className="flex items-center gap-2 text-[#6ab187] font-bold group-hover:gap-3 transition-all duration-300">
                                        <span>Learn More</span>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section className="py-24 bg-white relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#6ab187]/10 to-[#4a6b5b]/10 rounded-full px-5 py-2 mb-6">
                                <Star className="w-4 h-4 text-[#6ab187] fill-current" />
                                <span className="text-[#4a6b5b] text-sm font-bold  tracking-wider">Feedbacks</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                                What Our <span className="bg-gradient-to-r from-[#6ab187] to-[#4a6b5b] bg-clip-text text-transparent">Travelers</span> Say
                            </h2>
                            <p className="text-lg md:text-xl text-gray-600">
                                Real experiences from real travelers
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                {
                                    name: "Sarah Ahmed",
                                    location: "Dhaka",
                                    rating: 5,
                                    comment:
                                        "WanderNest made our Cox's Bazar trip absolutely perfect. The attention to detail was incredible!",
                                    avatar:
                                        "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150",
                                },
                                {
                                    name: "Michael Chen",
                                    location: "Singapore",
                                    rating: 5,
                                    comment:
                                        "As a foreign visitor, WanderNest's visa assistance and local guides were invaluable. Highly recommended!",
                                    avatar:
                                        "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150",
                                },
                                {
                                    name: "Fatima Rahman",
                                    location: "Chittagong",
                                    rating: 5,
                                    comment:
                                        "The Sundarbans tour was a once-in-a-lifetime experience. Professional service from start to finish.",
                                    avatar:
                                        "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150",
                                },
                            ].map((testimonial, index) => (
                                <div
                                    key={index}
                                    className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100"
                                >
                                    <div className="flex items-center gap-4 mb-6">
                                        <OptimizedImage
                                            src={testimonial.avatar}
                                            webpSrc={testimonial.avatar.replace(
                                                /\.(jpg|jpeg)$/i,
                                                ".webp"
                                            )}
                                            alt={testimonial.name}
                                            className="w-16 h-16 rounded-full object-cover shadow-md ring-4 ring-[#6ab187]/20"
                                            loading="lazy"
                                            decoding="async"
                                        />
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-lg">
                                                {testimonial.name}
                                            </h4>
                                            <p className="text-gray-600 text-sm">{testimonial.location}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-1 mb-4">
                                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                                            <Star
                                                key={i}
                                                className="w-5 h-5 text-[#6ab187] fill-current"
                                            />
                                        ))}
                                    </div>
                                    <p className="text-gray-700 leading-relaxed text-base italic">
                                        "{testimonial.comment}"
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 bg-gradient-to-br from-[#4a6b5b] to-[#0d1c1c] relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 left-0 w-96 h-96 bg-[#6ab187] rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#abb79a] rounded-full blur-3xl"></div>
                    </div>

                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                            Ready to Start Your <span className="text-[#6ab187]">Adventure</span>?
                        </h2>
                        <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto">
                            Join thousands of happy travelers and explore the beauty of Bangladesh with WanderNest
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                            <button
                                onClick={() => navigate("/packages")}
                                className="group w-full sm:w-auto px-10 py-5 bg-white text-[#4a6b5b] font-bold text-lg rounded-2xl shadow-2xl hover:shadow-white/50 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-3 min-w-[220px]"
                            >
                                Browse Packages
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                            </button>
                            <button
                                onClick={() => navigate("/destinations")}
                                className="w-full sm:w-auto px-10 py-5 bg-transparent border-2 border-white text-white font-bold text-lg rounded-2xl transition-all duration-300 hover:scale-105 hover:bg-white/10 active:scale-95 min-w-[220px]"
                            >
                                Explore Destinations
                            </button>
                        </div>
                    </div>
                </section>
            </main>
        </Layout>
    );
};

export default HomePage;

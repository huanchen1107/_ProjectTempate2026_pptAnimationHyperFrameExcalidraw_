import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import React from 'react';

export const SimpleLogo: React.FC<{titleText: string}> = ({titleText}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// 1. Calculate a smooth scale spring animation
	const scale = spring({
		frame,
		fps,
		config: {
			damping: 12, // Damping factor for spring physics
		},
	});

	// 2. Interpolate translation (slide in from bottom)
	const translateY = interpolate(frame, [0, 30], [100, 0], {
		extrapolateRight: 'clamp',
	});

	// 3. Interpolate opacity (fade in)
	const opacity = interpolate(frame, [0, 20], [0, 1], {
		extrapolateRight: 'clamp',
	});

	return (
		<div
			style={{
				flex: 1,
				backgroundColor: '#0d0e15', // Sleek dark mode canvas
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				fontFamily: 'Inter, system-ui, sans-serif',
			}}
		>
			<div
				style={{
					transform: `scale(${scale}) translateY(${translateY}px)`,
					opacity,
					background: 'rgba(255, 255, 255, 0.05)',
					backdropFilter: 'blur(16px)',
					borderRadius: '24px',
					border: '1px solid rgba(255, 255, 255, 0.1)',
					padding: '40px 60px',
					boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
					textAlign: 'center',
				}}
			>
				<h1
					style={{
						fontSize: '72px',
						fontWeight: 800,
						margin: 0,
						background: 'linear-gradient(45deg, #00f2fe, #4facfe)', // Premium cyan-blue gradient
						WebkitBackgroundClip: 'text',
						WebkitTextFillColor: 'transparent',
						letterSpacing: '-2px',
					}}
				>
					{titleText}
				</h1>
				<p
					style={{
						color: '#8a8b98',
						fontSize: '24px',
						marginTop: '16px',
						marginBottom: 0,
						fontWeight: 500,
					}}
				>
					React Video Animation
				</p>
			</div>
		</div>
	);
};

# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

---

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

---

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

---

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

---

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" -> "Write tests for invalid inputs, then make them pass"
- "Fix the bug" -> "Write a test that reproduces it, then make it pass"
- "Refactor X" -> "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] -> verify: [check]
2. [Step] -> verify: [check]
3. [Step] -> verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

## 5. Development Log (log.md)

**Every session MUST start and end with reading and updating `log.md`.**

Guidelines for maintaining `log.md`:
- Keep a single file `log.md` in the root of the project to record the chronological history of development.
- At the start of a session, the AI agent must read `log.md` to understand the previous progress and goals.
- During or at the end of every session, the AI agent MUST append to `log.md` under a new date header:
  1. **Today's date and header** (e.g. `## 2026.05.19`)
  2. **Key Accomplishments**: A clear, bulleted list of actual changes made, features built, or bugs fixed.
  3. **Technical Decisions/Conclusions**: Short bullet points on critical architectural choices or technical conclusions.
  4. **Next Tasks**: Explicit tasks that should be tackled next.
- Keep previous days' entries intact to preserve full history.

---

## 6. Project Setup & Remote Connection

- `startup.sh` automatically checks for a `.project_setup` file to detect the first-run.
- On the first run, it auto-detects your repository configurations, resets `.git`, runs an internal workspace cleanup, auto-provisions a GitHub repository (using `gh`), force-pushes initial commits, and creates a lockfile.
- On subsequent runs, it warm-boots by executing `git pull`, printing logs, and launching the **Claude Code CLI**.

---

## 🎬 7. Remotion Coding & Component Rules (Adapted from ThariqS Gist)

This is a remotion-based video app that uses React to render videos (adapted from the [ThariqS/Remotion Claude.md Gist](https://gist.github.com/ThariqS/3d446e7c7aa9eb94f468194deb73028f#claudemd)). For official Remotion documentation, consult: https://www.remotion.dev/docs/

### 📁 Project Structure

The Root file is usually named `src/Root.tsx` and looks like this:

```typescript
import {Composition} from 'remotion';
import {MyComp} from './MyComp';

export const Root: React.FC = () => {
	return (
		<>
			<Composition
				id="MyComp"
				component={MyComp}
				durationInFrames={120}
				width={1920}
				height={1080}
				fps={30}
				defaultProps={{}}
			/>
		</>
	);
};
```

A `<Composition>` defines a video that can be rendered. It consists of a React `component`, an `id`, a `durationInFrames`, a `width`, a `height` and a frame rate `fps`. The default frame rate should be 30. The default height should be 1080 and the default width should be 1920. The default `id` should be `MyComp`. The `defaultProps` must be in the shape of the React props the `component` expects.

Inside a React component, use the `useCurrentFrame()` hook to get the current frame number. Frame numbers start at 0.

```typescript
export const MyComp: React.FC = () => {
	const frame = useCurrentFrame();
	return <div>Frame {frame}</div>;
};
```

### ⚙️ Component Rules

Inside a component, regular HTML and SVG tags can be returned. There are special tags for video, images, gifs, and audio. Those special tags accept regular CSS styles.

#### 🎥 Video Elements (`<OffthreadVideo>`)
If a video is included in the component it should use the `<OffthreadVideo>` tag.
```typescript
import {OffthreadVideo} from 'remotion';

export const MyComp: React.FC = () => {
	return (
		<div>
			<OffthreadVideo
				src="https://remotion.dev/bbb.mp4"
				style={{width: '100%'}}
			/>
		</div>
	);
};
```
* `OffthreadVideo` has a `startFrom` prop that trims the left side of a video by a number of frames.
* `OffthreadVideo` has a `endAt` prop that limits how long a video is shown.
* `OffthreadVideo` has a `volume` prop that sets the volume of the video. It accepts values between 0 and 1.

#### 🖼️ Image Elements (`<Img>` / `<Gif>`)
* **Static Images**: If a non-animated image is included, use the `<Img>` tag.
  ```typescript
  import {Img} from 'remotion';
  export const MyComp: React.FC = () => {
  	return <Img src="https://remotion.dev/logo.png" style={{width: '100%'}} />;
  };
  ```
* **Animated GIFs**: If an animated GIF is included, the `@remotion/gif` package should be installed and the `<Gif>` tag should be used.
  ```typescript
  import {Gif} from '@remotion/gif';
  export const MyComp: React.FC = () => {
  	return (
  		<Gif
  			src="https://media.giphy.com/media/l0MYd5y8e1t0m/giphy.gif"
  			style={{width: '100%'}}
  		/>
  	);
  };
  ```

#### 🎵 Audio Elements (`<Audio>`)
If audio is included, the `<Audio>` tag should be used. Specify local assets (in the `public/` directory) using the `staticFile` API.
```typescript
import {Audio, staticFile} from 'remotion';

export const MyComp: React.FC = () => {
	return <Audio src={staticFile('audio.mp3')} />;
};
```
* `Audio` has a `startFrom` prop that trims the left side of a audio by a number of frames.
* `Audio` has a `endAt` prop that limits how long a audio is shown.
* `Audio` has a `volume` prop that sets the volume of the audio (values between 0 and 1).

---

### 🔀 Layout & Sequencing Helpers

#### 1. Layering Elements (`AbsoluteFill`)
If two elements should be rendered on top of each other, they should be layered using the `AbsoluteFill` component from "remotion".
```typescript
import {AbsoluteFill} from 'remotion';

export const MyComp: React.FC = () => {
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{background: 'blue'}}>
				<div>This is in the back</div>
			</AbsoluteFill>
			<AbsoluteFill style={{background: 'red'}}>
				<div>This is in front</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
```

#### 2. Timing Offsets (`Sequence`)
Any Element can be wrapped in a `Sequence` component to place the element later in the video timeline.
```typescript
import {Sequence} from 'remotion';

export const MyComp: React.FC = () => {
	return (
		<Sequence from={10} durationInFrames={20}>
			<div>This only appears after 10 frames</div>
		</Sequence>
	);
};
```
* `from`: frame number where the element should appear. (Can be negative, in which case the Sequence will start immediately but cut off the first `from` frames).
* `durationInFrames`: how long the element should remain visible.
* **Important**: If a child component of Sequence calls `useCurrentFrame()`, the enumeration starts from the first frame the Sequence appears and starts at `0`.

#### 3. Sequential Elements (`Series` / `TransitionSeries`)
* **Series**: For displaying multiple elements after another, use the `Series` component.
  ```typescript
  import {Series} from 'remotion';
  export const MyComp: React.FC = () => {
  	return (
  		<Series>
  			<Series.Sequence durationInFrames={20}>
  				<div>This only appears immediately</div>
  			</Series.Sequence>
  			<Series.Sequence durationInFrames={30}>
  				<div>This only appears after 20 frames</div>
  			</Series.Sequence>
  		</Series>
  	);
  };
  ```
* **TransitionSeries**: For transitions (fades, wipes) between sequential items, use the `@remotion/transitions` package.
  ```typescript
  import {linearTiming, springTiming, TransitionSeries} from '@remotion/transitions';
  import {fade} from '@remotion/transitions/fade';

  export const MyComp: React.FC = () => {
  	return (
  		<TransitionSeries>
  			<TransitionSeries.Sequence durationInFrames={60}>
  				<Fill color="blue" />
  			</TransitionSeries.Sequence>
  			<TransitionSeries.Transition
  				timing={springTiming({config: {damping: 200}})}
  				presentation={fade()}
  			/>
  			<TransitionSeries.Sequence durationInFrames={60}>
  				<Fill color="black" />
  			</TransitionSeries.Sequence>
  		</TransitionSeries>
  	);
  };
  ```

---

### 🎲 Determinism, Interpolation & Physics

#### 1. No `Math.random()`
Remotion requires rendering to be completely deterministic. **Never use the standard `Math.random()` API.** Instead, import the `random()` helper from "remotion" and pass a static seed string to it (returns values between 0 and 1).
```typescript
import {random} from 'remotion';

export const MyComp: React.FC = () => {
	return <div>Random number: {random('my-seed')}</div>;
};
```

#### 2. Smooth Interpolations (`interpolate()`)
Use `interpolate()` to smoothly scale or translate values over frame progressions.
```typescript
import {interpolate, useCurrentFrame} from 'remotion';

export const MyComp: React.FC = () => {
	const frame = useCurrentFrame();
	const opacity = interpolate(frame, [0, 100], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	return <div style={{opacity}}>Fading Content</div>;
};
```
* Always specify `extrapolateLeft: 'clamp'` and `extrapolateRight: 'clamp'` as a default best practice.

#### 3. Composition Configs (`useVideoConfig()`)
Use `useVideoConfig()` to retrieve dynamic configurations like `fps`, `durationInFrames`, `width`, and `height`.
```typescript
import {useVideoConfig} from 'remotion';
const {fps, durationInFrames, height, width} = useVideoConfig();
```

#### 4. Physics Animations (`spring()`)
Use the `spring()` helper to animate values with smooth, responsive spring physics:
```typescript
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';

export const MyComp: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const scale = spring({
		fps,
		frame,
		config: { damping: 200 },
	});
	return <div style={{transform: `scale(${scale})`}}>Spring Card</div>;
};
```

---

### 🎨 Remotion Components vs Normal React Components

| Feature / Aspect | Remotion Components | Normal React Components |
| :--- | :--- | :--- |
| **Execution Goal** | Rendered frame-by-frame into visual videos | Rendered dynamically in live DOM for users |
| **User Interaction** | **Strictly Forbidden** (No `onClick`, `onHover`) | Interactive (buttons, form inputs, clicks) |
| **State Hooks** | **No `useState` / `useReducer`** | Full state management (`useState`, etc.) |
| **Animation Trigger** | Strictly driven by frame number | CSS Transitions, requestAnimationFrame |
| **Side Effects** | **Avoid `useEffect`** (Keep calculations pure) | High use of `useEffect` for data fetch / subs |
| **Determinism** | Fully deterministic (same inputs = same video) | Non-deterministic (live clocks, dynamic API calls) |

#### Best Practices Summary:
1. Always use frame-based animations—**never** rely on time-based side effects.
2. Keep components pure—no event handlers, no async data fetching, no useState.
3. Leverage Sequences and Series for timing animations.
4. Ensure deterministic rendering for robust video export outputs.

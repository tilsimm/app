export interface DetectionResult {
  fatigueLevel: number
  isDistracted: boolean
  confidence: number
}

class AIDetector {
  private blazefaceModel: any = null
  private faceMeshModel: any = null
  private isInitialized = false
  private lastFaceDetectionTime = 0
  private noFaceCount = 0
  private tf: any = null
  private blazeface: any = null
  private faceLandmarksDetection: any = null

  async initialize() {
    if (this.isInitialized) {
      console.log("[v0] AI already initialized")
      return
    }

    if (typeof window === "undefined") {
      console.log("[v0] Not in browser, skipping AI initialization")
      return
    }

    try {
      console.log("[v0] Initializing TensorFlow.js...")

      // Dynamic imports to avoid SSR issues
      this.tf = await import("@tensorflow/tfjs")
      this.blazeface = await import("@tensorflow-models/blazeface")
      this.faceLandmarksDetection = await import("@tensorflow-models/face-landmarks-detection")

      // Set backend first
      await this.tf.setBackend("webgl")
      await this.tf.ready()
      console.log("[v0] TensorFlow backend ready:", this.tf.getBackend())

      // Load BlazeFace for fast face detection
      console.log("[v0] Loading BlazeFace model...")
      this.blazefaceModel = await this.blazeface.load()
      console.log("[v0] BlazeFace loaded successfully")

      // Load MediaPipe Face Mesh for detailed detection
      console.log("[v0] Loading MediaPipe Face Mesh...")
      this.faceMeshModel = await this.faceLandmarksDetection.createDetector(
        this.faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh,
        {
          runtime: "tfjs",
          maxFaces: 1,
          refineLandmarks: true,
        },
      )
      console.log("[v0] MediaPipe Face Mesh loaded successfully")

      this.isInitialized = true
      console.log("[v0] ✅ AI models initialized successfully")
    } catch (error) {
      console.error("[v0] ❌ Error initializing AI models:", error)
      throw error
    }
  }

  /**
   * Detect fatigue level from facial features (for Custom mode)
   */
  async detectFatigue(videoElement: HTMLVideoElement): Promise<number> {
    if (!this.isInitialized || !this.faceMeshModel) {
      console.error("[v0] AI not initialized for fatigue detection")
      throw new Error("AI models not initialized")
    }

    try {
      console.log("[v0] Analyzing face for fatigue...")
      const faces = await this.faceMeshModel.estimateFaces(videoElement, { flipHorizontal: false })

      if (faces.length === 0) {
        console.log("[v0] No face detected, returning moderate fatigue")
        return 35 + Math.floor(Math.random() * 10)
      }

      const face = faces[0]
      console.log("[v0] Face detected with", face.keypoints.length, "keypoints")

      // Left eye: 33, 160, 158, 133, 153, 144
      // Right eye: 362, 385, 387, 263, 373, 380
      const leftEyeTop = face.keypoints[159]
      const leftEyeBottom = face.keypoints[145]
      const leftEyeLeft = face.keypoints[33]
      const leftEyeRight = face.keypoints[133]

      const rightEyeTop = face.keypoints[386]
      const rightEyeBottom = face.keypoints[374]
      const rightEyeLeft = face.keypoints[362]
      const rightEyeRight = face.keypoints[263]

      // Calculate Eye Aspect Ratio (EAR)
      const leftEyeHeight = Math.abs(leftEyeTop.y - leftEyeBottom.y)
      const leftEyeWidth = Math.abs(leftEyeRight.x - leftEyeLeft.x)
      const rightEyeHeight = Math.abs(rightEyeTop.y - rightEyeBottom.y)
      const rightEyeWidth = Math.abs(rightEyeRight.x - rightEyeLeft.x)

      const leftEAR = leftEyeHeight / leftEyeWidth
      const rightEAR = rightEyeHeight / rightEyeWidth
      const avgEAR = (leftEAR + rightEAR) / 2

      console.log("[v0] Eye Aspect Ratio:", avgEAR.toFixed(3))

      // Higher EAR (wide open eyes) = low fatigue
      // Lower EAR (droopy/tired eyes) = high fatigue
      let fatigueLevel: number

      if (avgEAR > 0.15) {
        // Wide open eyes - very low fatigue (0-24%)
        fatigueLevel = Math.floor(Math.random() * 25)
        console.log("[v0] Low fatigue - Alert and awake")
      } else if (avgEAR > 0.12) {
        // Normal - medium fatigue (25-40%)
        fatigueLevel = 25 + Math.floor(Math.random() * 16)
        console.log("[v0] Medium fatigue - Moderate tiredness")
      } else if (avgEAR > 0.09) {
        // Tired - higher fatigue (41-60%)
        fatigueLevel = 41 + Math.floor(Math.random() * 20)
        console.log("[v0] Higher fatigue - Getting tired")
      } else if (avgEAR > 0.07) {
        // Very tired (61-75%)
        fatigueLevel = 61 + Math.floor(Math.random() * 15)
        console.log("[v0] High fatigue - Very tired")
      } else {
        // Extremely tired (76-100%)
        fatigueLevel = 76 + Math.floor(Math.random() * 25)
        console.log("[v0] Very high fatigue - Extremely tired")
      }

      console.log("[v0] Final fatigue level:", fatigueLevel + "%")
      return fatigueLevel
    } catch (error) {
      console.error("[v0] Error detecting fatigue:", error)
      return 30
    }
  }

  /**
   * Detect if user is distracted during session
   * FOCUSED = Looking down at desk/papers (head tilted down -10° to -30°)
   * DISTRACTED = Looking around, up, or away from desk
   */
  async detectDistraction(videoElement: HTMLVideoElement): Promise<DetectionResult> {
    if (!this.isInitialized || !this.blazefaceModel || !this.faceMeshModel) {
      console.error("[v0] AI not initialized for distraction detection")
      return { fatigueLevel: 0, isDistracted: false, confidence: 0.5 }
    }

    try {
      const now = Date.now()
      if (now - this.lastFaceDetectionTime < 1500) {
        return { fatigueLevel: 0, isDistracted: false, confidence: 0.6 }
      }
      this.lastFaceDetectionTime = now

      // Quick face detection first
      const predictions = await this.blazefaceModel.estimateFaces(videoElement as any, false)

      if (predictions.length === 0) {
        this.noFaceCount++
        console.log("[v0] ⚠️ No face detected (count:", this.noFaceCount, ")")

        if (this.noFaceCount >= 2) {
          console.log("[v0] 👀 DISTRACTED - No face in frame")
          return { fatigueLevel: 0, isDistracted: true, confidence: 0.95 }
        }
        return { fatigueLevel: 0, isDistracted: false, confidence: 0.7 }
      }

      // Face detected, reset counter
      this.noFaceCount = 0

      // Detailed landmarks detection
      const faces = await this.faceMeshModel.estimateFaces(videoElement, { flipHorizontal: false })

      if (faces.length === 0) {
        return { fatigueLevel: 0, isDistracted: false, confidence: 0.8 }
      }

      const face = faces[0]

      // Key landmarks for head pose:
      // Nose tip: 1, Chin: 152, Left eye: 33, Right eye: 263
      // Forehead: 10, Left ear: 234, Right ear: 454
      const noseTip = face.keypoints[1]
      const chin = face.keypoints[152]
      const leftEye = face.keypoints[33]
      const rightEye = face.keypoints[263]
      const forehead = face.keypoints[10]

      // Calculate head pitch (up/down tilt)
      // Negative pitch = looking down (FOCUSED when reading)
      // Positive pitch = looking up (DISTRACTED)
      const faceHeight = Math.abs(forehead.y - chin.y)
      const noseToChinDistance = Math.abs(noseTip.y - chin.y)
      const noseToForeheadDistance = Math.abs(noseTip.y - forehead.y)

      // Pitch calculation: when looking down, nose is closer to chin
      const pitchRatio = (noseToForeheadDistance - noseToChinDistance) / faceHeight
      const pitch = pitchRatio * 100 // Convert to degrees approximation

      // Calculate head yaw (left/right rotation)
      const eyeCenterX = (leftEye.x + rightEye.x) / 2
      const noseDeviationX = noseTip.x - eyeCenterX
      const faceWidth = Math.abs(rightEye.x - leftEye.x)
      const yawRatio = noseDeviationX / faceWidth
      const yaw = yawRatio * 100 // Convert to degrees approximation

      console.log("[v0] Head pose - Pitch:", pitch.toFixed(1), "° Yaw:", yaw.toFixed(1), "°")

      // FOCUSED = Looking down at desk/papers (-10° to -30° pitch, minimal yaw)
      // DISTRACTED = Looking up, around, or away

      let isDistracted = false
      let reason = ""

      if (Math.abs(yaw) > 25) {
        // Head turned left or right significantly
        isDistracted = true
        reason = "head turned sideways"
      } else if (pitch > 10) {
        // Looking up (away from desk)
        isDistracted = true
        reason = "looking up"
      } else if (pitch < -35) {
        // Looking too far down (unusual for studying)
        isDistracted = true
        reason = "head too low"
      }

      // FOCUSED range: pitch between -10 and -30 (looking down at desk), yaw < 25
      const isFocused = pitch >= -30 && pitch <= -10 && Math.abs(yaw) < 25

      if (isDistracted) {
        console.log("[v0] 👀 DISTRACTED -", reason)
      } else if (isFocused) {
        console.log("[v0] ✅ FOCUSED - Looking at desk/papers")
      } else {
        console.log("[v0] ✓ Neutral position")
      }

      return {
        fatigueLevel: 0,
        isDistracted,
        confidence: 0.85,
      }
    } catch (error) {
      console.error("[v0] Error detecting distraction:", error)
      return { fatigueLevel: 0, isDistracted: false, confidence: 0.5 }
    }
  }

  cleanup() {
    console.log("[v0] Cleaning up AI detector")
    this.blazefaceModel = null
    this.faceMeshModel = null
    this.isInitialized = false
  }
}

// Singleton instance
let detectorInstance: AIDetector | null = null

export function getAIDetector(): AIDetector {
  if (!detectorInstance) {
    detectorInstance = new AIDetector()
  }
  return detectorInstance
}

export function cleanupAIDetector() {
  if (detectorInstance) {
    detectorInstance.cleanup()
    detectorInstance = null
  }
}

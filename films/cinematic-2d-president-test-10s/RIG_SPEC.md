# Articulated character rig specification

Target: layered 2D cutout character faithful to the approved reference sheet.

Required groups:
head, hair_back, hair_front, ear_left, ear_right, eye_left, eye_right, brow_left, brow_right, nose, mouth_neutral, mouth_open, mouth_smile, neck, torso, jacket_front, jacket_back, shirt, tie, sash_upper, sash_lower, medal, sash_fringe, upper_arm_left, forearm_left, hand_left, upper_arm_right, forearm_right, hand_right, thigh_left, shin_left, shoe_left, thigh_right, shin_right, shoe_right.

Pivot hierarchy:
root -> torso -> neck -> head;
torso -> shoulder_left -> elbow_left -> wrist_left;
torso -> shoulder_right -> elbow_right -> wrist_right;
torso -> hip_left -> knee_left -> ankle_left;
torso -> hip_right -> knee_right -> ankle_right.

Face swaps must preserve the same head silhouette and alignment. Sash and medal follow torso motion, with secondary lag only if supported by the animation engine.

Acceptance tests:
1. No gaps at shoulder, elbow, wrist, hip, knee or ankle during motion.
2. No limb passes through the torso due to incorrect layer order.
3. Blink, mouth shapes and brows align with the original face.
4. Silhouette, hair, clothing, sash and medal remain visually consistent with the reference.

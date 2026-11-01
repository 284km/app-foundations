# 0002: Mobile stack

Status: accepted for the initial baseline. Reviewed: 2026-11-01.

## Context and decision

For a general-purpose product targeting both iOS and Android, start with TypeScript, React Native, and Expo. Share API contracts and appropriate domain logic with other clients. Design native screens and platform behavior independently from Web HTML.

## Reasons and evidence

React Native uses native components. Expo development builds support native libraries and custom native code, so native integration remains possible.

- [React Native components](https://reactnative.dev/docs/intro-react-native-components)
- [Expo development builds](https://docs.expo.dev/develop/development-builds/introduction/)
- [Expo custom native code](https://docs.expo.dev/workflow/customizing/)

## Costs, alternatives, and reconsideration

Shared code still needs platform testing, compatible Expo/React Native/React versions, native dependency upgrades, and OS-specific work. An exported JavaScript bundle does not establish native build or device correctness.

Prefer Swift with SwiftUI/UIKit and Kotlin with Jetpack Compose when deep OS integration or platform-specific interaction dominates. Flutter is a candidate for a consistent custom-rendered interface across platforms. Reconsider when camera/audio/Bluetooth/background behavior, new OS APIs, or profiling shows the shared approach obstructs the product.

Native alternatives are documented candidates, not implemented or benchmarked starters. Do not raise React Native or React independently of Expo's supported versions.

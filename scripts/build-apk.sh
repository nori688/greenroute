#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# GreenRoute → APK (debug)
#
# Неге осылай: AGP/aapt2 Windows-та кирилл әріптері бар жолмен жұмыс істемейді
# (жоба "Рабочий стол" ішінде тұр), сондықтан Gradle жинағы ASCII жолда
# (C:\gr-build) орындалады, дайын APK қайта жобаға көшіріледі.
#
# Қолдану:  bash scripts/build-apk.sh
# ---------------------------------------------------------------------------
set -euo pipefail

PROJECT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BUILD_DIR="${GR_BUILD_DIR:-/c/gr-build}"
JAVA_HOME_WIN="${JAVA_HOME_WIN:-C:\\Users\\nurzh\\jdk-21.0.12.1+1}"
ANDROID_HOME_WIN="${ANDROID_HOME_WIN:-C:\\Users\\nurzh\\Android\\Sdk}"
APK_OUT="$PROJECT/GreenRoute-debug.apk"

echo "▸ 1/5  Веб-жинақ (vite build)"
npm --prefix "$PROJECT" run build >/dev/null
echo "    дайын: dist/"

echo "▸ 2/5  Capacitor sync (dist → android/app/src/main/assets/public)"
npx --prefix "$PROJECT" cap sync android >/dev/null 2>&1 || (cd "$PROJECT" && npx cap sync android >/dev/null)

echo "▸ 3/5  Жобаны ASCII жолға көшіру: $BUILD_DIR"
rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR/node_modules/@capacitor"
cp -r "$PROJECT/android" "$BUILD_DIR/android"
# capacitor.settings.gradle мына жолды талап етеді: ../node_modules/@capacitor/android/capacitor
cp -r "$PROJECT/node_modules/@capacitor/android" "$BUILD_DIR/node_modules/@capacitor/android"
cp "$PROJECT/capacitor.config.json" "$BUILD_DIR/" 2>/dev/null || true
printf 'sdk.dir=%s\n' "${ANDROID_HOME_WIN//\\/\\\\}" > "$BUILD_DIR/android/local.properties"

echo "▸ 4/5  Gradle assembleDebug (JDK 21 + SDK 35)"
cd "$BUILD_DIR/android"
JAVA_HOME="$JAVA_HOME_WIN" ANDROID_HOME="$ANDROID_HOME_WIN" ./gradlew assembleDebug --console=plain

echo "▸ 5/5  APK-ны жобаға көшіру"
cp "$BUILD_DIR/android/app/build/outputs/apk/debug/app-debug.apk" "$APK_OUT"
ls -lh "$APK_OUT"
echo "✅ Дайын: $APK_OUT"

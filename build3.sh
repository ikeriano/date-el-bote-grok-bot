#!/bin/bash
# build3.sh <app> <paquete> "<Etiqueta>" <BaseFichero> : APK firmado (ikeriano-2026b) + exe portable de Windows (Electron)
export JAVA_HOME=/home/box/jdk17; export PATH=$JAVA_HOME/bin:$PATH
set -e; A=$1; PKG=$2; LBL=$3; FB=$4; V=1.0; D=/workspace/nuevos3/build/$A; rm -rf $D; mkdir -p $D/apk/res/mipmap-xxhdpi $D/out; cd $D
B=$(mktemp -d /tmp/gb3.XXXX); BT=/home/box/android-sdk/build-tools/34.0.0; AJ=/home/box/android-sdk/platforms/android-34/android.jar
KS=/workspace/keys/ikeriano-2026b.jks; KPR=/workspace/keys/keystore.properties
SP=$(grep storePassword $KPR|cut -d= -f2-); KP=$(grep keyPassword $KPR|cut -d= -f2-); AL=$(grep keyAlias $KPR|cut -d= -f2-)
WWW=/workspace/nuevos3/$A/www; PD=apk/src/$(echo $PKG|tr . /); mkdir -p $PD
python3 -c "from PIL import Image;Image.open('$WWW/icon.png').convert('RGBA').resize((144,144)).save('apk/res/mipmap-xxhdpi/ic_launcher.png')"
sed "s/package com.ikeriano.ruedalaletra;/package $PKG;/" /workspace/rueda/apk/src/com/ikeriano/ruedalaletra/MainActivity.java > $PD/MainActivity.java
cat > apk/AndroidManifest.xml <<M
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android" package="$PKG" android:versionCode="1" android:versionName="$V">
<uses-sdk android:minSdkVersion="21" android:targetSdkVersion="34"/>
<application android:label="$LBL" android:icon="@mipmap/ic_launcher" android:hardwareAccelerated="true" android:largeHeap="true">
<activity android:name=".MainActivity" android:exported="true" android:screenOrientation="sensorLandscape" android:configChanges="orientation|screenSize|keyboardHidden|keyboard" android:theme="@android:style/Theme.NoTitleBar.Fullscreen">
<intent-filter><action android:name="android.intent.action.MAIN"/><category android:name="android.intent.category.LAUNCHER"/></intent-filter></activity>
</application></manifest>
M
$BT/aapt2 compile --dir apk/res -o $B/res.zip
$BT/aapt2 link -o $B/base.apk -I $AJ --manifest apk/AndroidManifest.xml -R $B/res.zip --java $B/gen
mkdir -p $B/cls; /home/box/jdk17/bin/javac -source 8 -target 8 -nowarn -cp $AJ -d $B/cls $(find apk/src $B/gen -name '*.java') 2>/dev/null
$BT/d8 --min-api 21 --output $B $(find $B/cls -name '*.class')
python3 - "$B" "$WWW" <<'P'
import zipfile,os,sys;B,W=sys.argv[1:3];src=zipfile.ZipFile(B+'/base.apk');o=zipfile.ZipFile(B+'/u.apk','w')
for i in src.infolist():o.writestr(i,src.read(i.filename))
o.write(B+'/classes.dex','classes.dex',zipfile.ZIP_DEFLATED)
for r,d,f in os.walk(W):
  for n in sorted(f):
    p=os.path.join(r,n);a='assets/www/'+os.path.relpath(p,W);o.write(p,a,zipfile.ZIP_STORED if n.endswith(('.mp3','.png','.jpg')) else zipfile.ZIP_DEFLATED)
o.close()
P
$BT/zipalign -f -p 4 $B/u.apk $B/a.apk
$BT/apksigner sign --ks $KS --ks-key-alias "$AL" --ks-pass pass:"$SP" --key-pass pass:"$KP" --out out/$FB-$V.apk $B/a.apk; rm -rf $B
$BT/apksigner verify out/$FB-$V.apk && echo APK_OK
# --- Windows portable
if [ "$NOWIN" != 1 ]; then
port=$((41000 + $(echo -n $PKG | cksum | cut -d' ' -f1) % 8000))
mkdir -p pc/app pc/build; cd pc; cp /workspace/pc/tpl/app/main.js /workspace/pc/tpl/app/preload.js app/; cp $WWW/icon.png build/icon.png; cp -r $WWW app/www
echo "{\"nombre\":\"$LBL\",\"port\":$port}" > app/juego.json; ln -s /workspace/pc/tpl/node_modules node_modules
echo "{\"name\":\"$A-pc\",\"version\":\"1.0.0\",\"description\":\"$LBL (PC)\",\"author\":\"Iker Rodríguez\",\"main\":\"app/main.js\",\"private\":true}" > package.json
echo "{\"appId\":\"$PKG\",\"productName\":\"$LBL\",\"electronVersion\":\"33.4.11\",\"directories\":{\"output\":\"dist\",\"buildResources\":\"build\"},\"files\":[\"app/**/*\",\"package.json\"],\"asar\":false,\"compression\":\"normal\",\"win\":{\"signAndEditExecutable\":false,\"target\":[{\"target\":\"portable\",\"arch\":[\"x64\"]}]},\"portable\":{\"artifactName\":\"$FB-$V-Windows-portable.exe\"},\"extraMetadata\":{\"main\":\"app/main.js\"}}" > eb.json
./node_modules/.bin/electron-builder --config eb.json --publish never --win > build.log 2>&1 || { tail -20 build.log; exit 1; }
mv dist/$FB-$V-Windows-portable.exe ../out/; cd ..; rm -rf pc
fi
ls -la out

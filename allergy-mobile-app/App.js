import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

// 🌎 TÜM DİLLERİN ÇEVİRİ SÖZLÜĞÜ (TR, FI, EN, SV)
const translations = {
  TR: {
    title: "🛡️ Alerji Tarayıcı",
    button: "📸 Ürün Fotoğrafı Seç",
    waiting: "Tarama için fotoğraf seçilmesi bekleniyor...",
    scanning: "Ürün içeriği taranıyor, lütfen bekleyin...",
    dangerStatus: "⚠️ TEHLİKE: GLUTEN VE FISTIK TESPİT EDİLDİ!",
    alertTitle: "Alerjen Uyarısı!",
    alertBody: "Dikkat! Bu ürün şunları içeriyor: GLUTEN, FISTIK",
    alertBtn: "Anladım",
    permissionErr: "Ürün etiketlerini tarayabilmek için galeri erişimine izin vermeniz gerekiyor!"
  },
  FI: {
    title: "🛡️ Allergiaskanneri",
    button: "📸 Valitse tuotteen kuva",
    waiting: "Odotetaan kuvan valintaa skannausta varten...",
    scanning: "Skannataan tuotteen ainesosia, odota hetki...",
    dangerStatus: "⚠️ VAARA: GLUTEENIA JA PÄHKINÄÄ HAVAITTU!",
    alertTitle: "Allergiähälytys!",
    alertBody: "Varoitus! Tämä tuote sisältää: GLUTEENIA, PÄHKINÄÄ",
    alertBtn: "Selvä",
    permissionErr: "Sinun täytyy sallia gallerian käyttö skannataksesi tuotteita!"
  },
  EN: {
    title: "🛡️ Allergy Scanner",
    button: "📸 Select Product Photo",
    waiting: "Waiting for scan...",
    scanning: "Scanning product ingredients...",
    dangerStatus: "⚠️ DANGER: GLUTEN & PEANUT DETECTED!",
    alertTitle: "Allergy Alert",
    alertBody: "Warning! This product contains: GLUTEN, PEANUT",
    alertBtn: "OK",
    permissionErr: "You need to allow gallery access to scan products!"
  },
  SV: {
    title: "🛡️ Allergiskanner",
    button: "📸 Välj produktbild",
    waiting: "Väntar på bild för att skanna...",
    scanning: "Skannar produktens ingredienser, vänligen vänta...",
    dangerStatus: "⚠️ FARA: GLUTEN OCH JORDNÖTTER UPPTÄCKTA!",
    alertTitle: "Allergivarning!",
    alertBody: "Varning! Denna produkt innehåller: GLUTEN, JORDNÖTTER",
    alertBtn: "Uppfattat",
    permissionErr: "Du måste tillåta galleriåtkomst för att skanna produkter!"
  }
};

export default function App() {
  const [lang, setLang] = useState('TR'); // Varsayılan dil Türkçe
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(translations['TR'].waiting);

  // Dil Değiştiğinde Durum Yazısını Güncelleme
  const changeLanguage = (selectedLang) => {
    setLang(selectedLang);
    setStatus(translations[selectedLang].waiting);
    setImage(null);
  };

  // Gerçek Galeriyi Açma Fonksiyonu
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert("Error / Virhe", translations[lang].permissionErr);
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImageUri = result.assets[0].uri;
      setImage(selectedImageUri);
      setLoading(true);
      setStatus(translations[lang].scanning);

      // 2 Saniyelik Çok Dilli Simülasyon
      setTimeout(() => {
        setLoading(false);
        setStatus(translations[lang].dangerStatus);
        Alert.alert(
          translations[lang].alertTitle,
          translations[lang].alertBody,
          [{ text: translations[lang].alertBtn }]
        );
      }, 2000);
    }
  };

  return (
    <View style={styles.container}>
      {/* 🌐 DİL SEÇİM MENÜSÜ */}
      <View style={styles.langSelector}>
        {['TR', 'FI', 'EN', 'SV'].map((l) => (
          <TouchableOpacity 
            key={l} 
            style={[styles.langButton, lang === l && styles.activeLangButton]} 
            onPress={() => changeLanguage(l)}
          >
            <Text style={[styles.langText, lang === l && styles.activeLangText]}>{l}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.title}>{translations[lang].title}</Text>

      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>{translations[lang].button}</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#ff4757" style={{ marginBottom: 20 }} />}

      {image && !loading && (
        <Image source={{ uri: image }} style={styles.imagePreview} />
      )}

      <View style={styles.statusBox}>
        <Text style={styles.statusText}>{status}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  langSelector: {
    flexDirection: 'row',
    marginBottom: 50,
    backgroundColor: '#f1f2f6',
    borderRadius: 25,
    padding: 5,
  },
  langButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  activeLangButton: {
    backgroundColor: '#ff4757',
  },
  langText: {
    fontWeight: 'bold',
    color: '#2f3542',
  },
  activeLangText: {
    color: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#ff4757',
  },
  button: {
    backgroundColor: '#2ed573',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imagePreview: {
    width: 220,
    height: 220,
    borderRadius: 10,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  statusBox: {
    marginTop: 10,
    padding: 10,
  },
  statusText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#7f8c8d',
    textAlign: 'center',
    fontWeight: '500',
  },
});
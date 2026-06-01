# --- PROFESYONEL ALLERJEN SİSTEMİ ---

ALLERGENS_MULTI = {
    "Gluten": {"tr": ["buğday", "arpa", "çavdar", "yulaf", "glüten"], "en": ["wheat", "barley", "rye", "oats", "gluten"]},
    "Soya": {"tr": ["soya", "soya sütü", "soya lesitini"], "en": ["soy", "soy milk", "soy lecithin"]},
    "Sert Kabuklu Meyveler": {"tr": ["fındık", "badem", "ceviz"], "en": ["hazelnut", "almond", "walnut"]},
    "Yer Fıstığı": {"tr": ["yer fıstığı", "fıstık"], "en": ["peanut"]},
    "Kabuklu Deniz Ürünleri": {"tr": ["karides", "yengeç", "istakoz"], "en": ["shrimp", "crab", "lobster"]}
}

def check_product(ingredients_text, language_code):
    ingredients_text = ingredients_text.lower()
    detected = []
    for allergen, translations in ALLERGENS_MULTI.items():
        keywords = translations.get(language_code, [])
        for keyword in keywords:
            if keyword in ingredients_text:
                detected.append(allergen)
    return list(set(detected))

# TEST ETMEK İÇİN:
test_etiketi = "İçindekiler: Buğday unu, fındık, soya lesitini ve karides içerir."
sonuc = check_product(test_etiketi, 'tr')
print(f"Tespit Edilenler: {sonuc}")# --- PROFESYONEL ORANLI ALERJEN ANALİZ SİSTEMİ ---

ALLERGENS_MULTI = {
    "Gluten": {"tr": ["buğday", "arpa", "glüten"], "en": ["wheat", "barley", "gluten"]},
    "Sert Kabuklu Meyveler": {"tr": ["fındık", "badem"], "en": ["hazelnut", "almond"]}
}

def analyze_with_threshold(ingredients_text, language, user_limit):
    # Bu fonksiyon metni tarar, içindeki yüzdeleri bulur ve kıyaslar
    import re
    ingredients_text = ingredients_text.lower()
    results = {}
    
    for allergen, translations in ALLERGENS_MULTI.items():
        keywords = translations.get(language, [])
        for keyword in keywords:
            if keyword in ingredients_text:
                # Regex ile yüzdeyi yakala (örn: %0.1 veya 0.1%)
                match = re.search(r'(\d+\.?\d*)\s*%', ingredients_text)
                percentage = float(match.group(1)) if match else 99.0 # Yüzde yoksa yüksek risk say
                
                status = "GÜVENLİ" if percentage <= user_limit else "RİSKLİ"
                results[allergen] = {"oran": f"%{percentage}", "durum": status}
    return results

# TEST: Kullanıcı diyor ki "Ben %0.5'e kadar eser miktarı tolere edebilirim"
test_etiketi = "İçindekiler: Buğday unu (%0.1), fındık (%1.2)."
analiz = analyze_with_threshold(test_etiketi, 'tr', user_limit=0.5)

print(f"--- ANALİZ SONUCU ---")
for alerjen, detay in analiz.items():
    print(f"{alerjen}: {detay['oran']} - {detay['durum']}")
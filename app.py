import streamlit as st

ALLERGENS = {
    "Gluten": {"tr": ["buğday", "arpa", "glüten"], "en": ["wheat", "barley", "gluten"]},
    "Fındık": {"tr": ["fındık", "badem"], "en": ["hazelnut", "almond"]}
}

st.set_page_config(page_title="Alerjen Asistanı", page_icon="🛡️")
st.title("🛡️ Alerjen Güvenlik Asistanı")

lang = st.selectbox("Dil Seçin / Select Language", ["tr", "en"])
etiket = st.text_area("İçindekiler listesini buraya yapıştırın:")

if st.button("Analiz Et", key="analiz_butonu"):
    st.write("Analiz ediliyor...")
    for alerjen, diller in ALLERGENS.items():
        kelimeler = diller.get(lang, [])
        if any(k in etiket.lower() for k in kelimeler):
            st.error(f"⚠️ RİSK: Bu üründe {alerjen} tespit edildi!")
        else:
            st.success(f"✅ {alerjen} bulunamadı.")

kamera_foto = st.camera_input("Ürün etiketini çek")
import json
import random

CITIES = [
    {"id": "astana", "name": "Астана", "lat": 51.169392, "lon": 71.449074},
    {"id": "almaty", "name": "Алматы", "lat": 43.222015, "lon": 76.851248},
    {"id": "shymkent", "name": "Шымкент", "lat": 42.341667, "lon": 69.592778},
    {"id": "karaganda", "name": "Караганда", "lat": 49.801857, "lon": 73.102142},
    {"id": "aktobe", "name": "Актобе", "lat": 50.283944, "lon": 57.166986},
    {"id": "pavlodar", "name": "Павлодар", "lat": 52.285516, "lon": 76.940989},
]

CLINIC_NAMES = [
    "Medical Park", "Dostarmed", "Suncar", "Emirmed", "Kеруен Medicus", 
    "Hak Medical", "A-Clinic", "Олимп", "Сункар", "ZhanaMed", 
    "HealthCity", "Private Clinic", "Tais-Med", "Astana Vision", "Mediker"
]

CATEGORIES = [
    {"id": "consult", "name": "Приемы и консультации", "icon": "consult_icon"},
    {"id": "lab", "name": "Лабораторная диагностика", "icon": "lab_diagnostic_icon"},
    {"id": "ray", "name": "Лучевая диагностика", "icon": "ray_icon"},
    {"id": "ultrasound", "name": "Ультразвуковая диагностика", "icon": "ultrasound_icon"},
    {"id": "func", "name": "Функциональная диагностика", "icon": "func_icon"},
    {"id": "endoscopy", "name": "Эндоскопия", "icon": "endoscopy_icon"},
    {"id": "procedures", "name": "Процедуры и манипуляции", "icon": "procedures_icon"},
    {"id": "surgery", "name": "Хирургия", "icon": "surgery_icon"},
    {"id": "physio", "name": "Физиотерапия", "icon": "physio_icon"},
    {"id": "dentistry", "name": "Стоматология", "icon": "dentistry_icon"},
    {"id": "other", "name": "Прочее", "icon": "other_icon"}
]

SERVICES = {
    "Приемы и консультации": [
        ("Первичная консультация терапевта", 8000, 15000),
        ("Повторная консультация терапевта", 5000, 10000),
        ("Консультация кардиолога", 10000, 20000),
        ("Консультация невролога", 9000, 18000),
        ("Консультация педиатра", 8000, 16000)
    ],
    "Лабораторная диагностика": [
        ("Общий анализ крови (ОАК)", 2000, 5000),
        ("Общий анализ мочи (ОАМ)", 1500, 3000),
        ("Биохимический анализ крови (расширенный)", 8000, 25000),
        ("ПЦР на COVID-19", 6000, 15000),
        ("Коагулограмма", 4000, 9000)
    ],
    "Лучевая диагностика": [
        ("МРТ головного мозга", 25000, 60000),
        ("КТ органов грудной клетки", 20000, 45000),
        ("МРТ позвоночника", 25000, 65000),
        ("Рентгенография легких", 4000, 12000)
    ],
    "Ультразвуковая диагностика": [
        ("УЗИ брюшной полости", 8000, 25000),
        ("УЗИ органов малого таза", 7000, 20000),
        ("УЗИ щитовидной железы", 6000, 15000),
        ("Эхокардиография (УЗИ сердца)", 10000, 30000)
    ],
    "Функциональная диагностика": [
        ("ЭКГ с расшифровкой", 3000, 8000),
        ("Холтеровское мониторирование ЭКГ", 15000, 35000),
        ("ЭЭГ", 10000, 25000)
    ],
    "Стоматология": [
        ("Лечение кариеса (1 зуб)", 15000, 40000),
        ("Профессиональная чистка зубов", 12000, 35000),
        ("Удаление зуба мудрости", 20000, 60000)
    ]
}

clinics_data = []
clinic_id = 1
logo_variants = [f"/clinic_logos/logo_{i}.png" for i in range(1, 21)]

print("Имитация парсинга и стандартизации (Процессинг Case 1)...")

for city in CITIES:
    # 15 клиник в Алматы и Астане, по 5-8 в других городах
    num_clinics = random.randint(10, 15) if city['id'] in ['almaty', 'astana'] else random.randint(5, 8)
    
    for _ in range(num_clinics):
        name = random.choice(CLINIC_NAMES)
        street = random.choice(["Абая", "Сатпаева", "Достык", "Республики", "Ауэзова", "Толе би"])
        address = f"г. {city['name']}, ул. {street} {random.randint(1, 200)}"
        
        clinic = {
            "id": clinic_id,
            "name": name,
            "cityId": city['id'],
            "cityName": city['name'],
            "address": address,
            "rating": round(random.uniform(3.8, 5.0), 1),
            "reviews": random.randint(10, 2500),
            "logo": random.choice(logo_variants),
            "priceList": []
        }
        
        # Генерация стандартизированных услуг для клиники
        service_id = clinic_id * 1000
        for cat_name, services in SERVICES.items():
            # Каждая клиника предоставляет 60% возможных услуг из категории
            for s_name, min_p, max_p in services:
                if random.random() > 0.4:
                    price = random.randint(min_p, max_p)
                    # Округляем до сотен
                    price = (price // 100) * 100
                    
                    clinic["priceList"].append({
                        "id": service_id,
                        "name": s_name,
                        "category": cat_name,
                        "price": price
                    })
                    service_id += 1
                    
        clinics_data.append(clinic)
        clinic_id += 1

js_content = f"""// AUTO-GENERATED FILE
// Данные сгенерированы скриптом generate_db.py

export const topCategories = {json.dumps(CATEGORIES, ensure_ascii=False, indent=2)};

export const clinics = {json.dumps(clinics_data, ensure_ascii=False, indent=2)};

export const services = {json.dumps(SERVICES, ensure_ascii=False, indent=2)};
"""

with open("/home/moukpu/Рабочий стол/case 2/src/data/mockData.js", "w", encoding="utf-8") as f:
    f.write(js_content)

print(f"Успешно сгенерировано {len(clinics_data)} клиник с полными прайсами!")
print("Файл mockData.js перезаписан.")

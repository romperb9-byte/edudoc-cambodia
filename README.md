# សៀវភៅណែនាំការប្រើប្រាស់ Web Application គ្រប់គ្រងសៀវភៅចុះលិខិតចេញ និងសៀវភៅចុះលិខិតចូល

ប្រព័ន្ធនេះត្រូវបានរចនាឡើងយ៉ាងយកចិត្តទុកដាក់ស្របតាម **ស្តង់ដាររដ្ឋបាលនៃស្ថាប័នអប់រំកម្ពុជា** ដោយរក្សាទម្រង់សៀវភៅផ្លូវការ **៥ ជួរឈរជាក់ស្តែង** ទាំងនៅលើ Web View, Print Preview, A4/A5 Print និងការតភ្ជាប់ជាមួយ **Google Sheets Database**។

---

## ១. របៀបបើកដំណើរការ Web Application ភ្លាមៗ

អ្នកអាចបើកមើលកម្មវិធីបានភ្លាមៗដោយ៖
1. ចូលទៅកាន់ថត Folder: `C:\Users\Asus\.gemini\antigravity\scratch\edudoc-cambodia\`
2. Double-click លើឯកសារ [index.html](file:///C:/Users/Asus/.gemini/antigravity/scratch/edudoc-cambodia/index.html) លើ Browser ណាមួយ (Chrome, Edge, Firefox, Brave)។

---

## ២. របៀបភ្ជាប់ Google Sheets Database តាមរយៈ Google Apps Script

នៅក្នុងថតគម្រោងមានឯកសារ [Code.gs](file:///C:/Users/Asus/.gemini/antigravity/scratch/edudoc-cambodia/Code.gs) ស្រាប់៖

1. បង្កើត **Google Spreadsheet** ថ្មីមួយលើ Google Drive របស់អ្នក។
2. ក្នុង Google Sheet នោះ ចុចលើ Menu **Extensions** (ផ្នែកបន្ថែម) -> **Apps Script**។
3. ចម្លង (Copy) កូដពី [Code.gs](file:///C:/Users/Asus/.gemini/antigravity/scratch/edudoc-cambodia/Code.gs) ទៅបិទភ្ជាប់ក្នុងផ្ទាំង Apps Script ជំនួសកូដចាស់។
4. ចុចប៊ូតុង **Deploy** (ដាក់ឱ្យប្រើប្រាស់) -> **New deployment** (ការដាក់ឱ្យប្រើប្រាស់ថ្មី)៖
   - ជ្រើសរើសប្រភេទ (Select type): **Web App**
   - Execute as: **Me** (គណនីអ៊ីមែលរបស់អ្នក)
   - Who has access: **Anyone** (អ្នកណាក៏ដោយ)
5. ចុច **Deploy** រួច Authorize permissions ហើយចម្លងយក **Web App URL** (ឧ. `https://script.google.com/macros/s/.../exec`)។
6. បើក Web App [index.html](file:///C:/Users/Asus/.gemini/antigravity/scratch/edudoc-cambodia/index.html) ចូលទៅផ្ទាំង **ការកំណត់ (Settings)** -> បិទភ្ជាប់ URL នោះចូលក្នុងប្រអប់ **Google Apps Script Web App URL** រួចចុច **រក្សាទុកការកំណត់**។
   
*ចំណាំ៖ ប្រសិនបើមិនទាន់បានដាក់ Apps Script URL ទេ កម្មវិធីនឹងរក្សាទុកទិន្នន័យក្នុង Browser Local Storage ដោយស្វ័យប្រវត្តិ មិនបាត់បង់ទិន្នន័យឡើយ។*

---

## ៣. ការរៀបចំទម្រង់ ៥ ជួរឈរតាមការកំណត់

### សៀវភៅចុះលិខិតចេញ
- ចំណងជើង៖ **សៀវភៅចុះលិខិតចេញ**
- បឋមកថាស្វ័យប្រវត្តិ៖
  - **លេខ........ ដល់លេខ........ សរុប........**
  - **ថ្ងៃទី........ ខែ........ ឆ្នាំ........ ដល់ ថ្ងៃទី........ ខែ........ ឆ្នាំ........**
- ៥ ជួរឈរជាក់ស្តែង៖
  1. **ល.រ**
  2. **ខ្លឹមសារលិខិត ថ្ងៃទី ខែ ឆ្នាំ**
  3. **ចំនួន**
  4. **ក្រសួងទទួល**
  5. **សេចក្ដីផ្សេងៗ**

### សៀវភៅចុះលិខិតចូល
- ចំណងជើង៖ **សៀវភៅចុះលិខិតចូល**
- បឋមកថាស្វ័យប្រវត្តិ៖
  - **លេខ........ ដល់លេខ........ សរុប........**
  - **ថ្ងៃទី........ ខែ........ ឆ្នាំ........ ដល់ ថ្ងៃទី........ ខែ........ ឆ្នាំ........**
- ៥ ជួរឈរជាក់ស្តែង៖
  1. **ល.រ**
  2. **ខ្លឹមសារលិខិត ក្រសួងដើម**
  3. **ចំនួន**
  4. **លេខលិខិតដើម ថ្ងៃទី ខែ ឆ្នាំ**
  5. **សេចក្ដីផ្សេងៗ**

---

## ៤. មុខងារបោះពុម្ព (Print Layout & A4/A5 Support)
- **Print Preview Mode**: អនុញ្ញាតឱ្យពិនិត្យផ្ទៀងផ្ទាត់សៀវភៅទាំងមូលមុនបោះពុម្ព។
- **Print CSS**: លាក់ Sidebar, Menus, Buttons, Search bars ដោយស្វ័យប្រវត្តិនៅពេលចុចបញ្ជា `Ctrl + P` ឬប៊ូតុង Print ដោយបន្សល់ទុកតែទំព័រសៀវភៅរដ្ឋបាលសុទ្ធសាធ។
- គាំទ្រទំហំក្រដាស **A4** និង **A5** ទាំង Portrait និង Landscape។
- មុខងារ **Export CSV** (UTF-8 with BOM) សម្រាប់បើកជាមួយ Microsoft Excel ដោយមិនបែកពុម្ពអក្សរខ្មែរ។

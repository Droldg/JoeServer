# Computerneværk og distribuerede systemer - Joe and The Juice - HA(IT) 3. semester

Denne server er bygget på et fundament af forskellige API'er og services. Fx er Google Maps JS API blevet brugt til at lave et kort over JATJ-lokationer. API-nøglen er blevet fjernet, men er stadig til at finde i de tidligere commits. De er dog IP-restricted og kan derfor ikke misbruges. Derudover er vores SQL-login også blevet fjernet fra `config.js`.
Da vores webhook automatisk opdaterer hjemmesiden ud fra dette repo, vil de også være fjernet fra vores offentlige hjemmeside.

Man skal derfor ikke regne med en fuldt ud virkende hjemmeside.

Siden kan dog stadig findes på **[hait-joe.live](http://hait-joe.live)**. Og kan ses i videodemonstrationen her: [Link til video](https://www.loom.com/share/f73cd5452c3d405ebfacee43a4308856).

---

## **Forudsætninger**
For at få applikationen til at køre lokalt, skal følgende være installeret:
- Node.js (seneste LTS-version)
- NPM (Node Package Manager)
- API-nøgler til Google Maps
- SQL login i `config.js`

---

## **Kommandoer til at starte Express-serveren**

### 1. Clone repository og installer afhængigheder
```bash
git clone https://github.com/Droldg/JoeServer
cd JoeServer
npm install
```

### 2. Start serveren
```bash
node app.js
```
Serveren vil starte på `http://localhost:3000`



---

## **Ekstramateriale**
- **README-fil**: Indeholder vejledning til opsætning af applikationen lokalt.
- **Cloud-konfigurationer**: API-nøgler og credentials er fjernet.
- **Screencast-video**: Demonstrerer applikationens funktionalitet og implementerede faglige emner. [Link til video](https://www.loom.com/share/f73cd5452c3d405ebfacee43a4308856).
- `./python`
---

## **Google Geolocation API (`./python`)** 
For at hente de specifikke koordinater til hver Joe and The Juice lokation, har vi brugt Googles Geolocation API. Denne har vi brugt i et python script til at hente latitude og longitude, for et array vi har givet programmet. Dette array har adresserne for hver Joe and The Juice på sjælland.
Scriptet kan kun køres med en gyldig API-nøgle, men kan køres ved

```bash
cd JoeServer
cd python
python ./main.py
```



---

## **Screencast-video**
For at få en kort demonstration af applikationen og dens funktionaliteter, se videoen her:  
[Link til screencast-video](https://www.loom.com/share/f73cd5452c3d405ebfacee43a4308856)

---
## **Arkitektur**
Lavet i PlantUML
![PlantUML-diagram](https://www.plantuml.com/plantuml/png/fPHFRnCn4CNl_XGZSu534t52S43z4we6fI7DWdf0FJZhIRgjumbZRqX0_UxiU7TLir8FY1oiQERtvatUI56d8HgEzTOf5HuhlpDijh0ovUE6gVRsWXmnl5g_Az_QzndXoIByLW3d0_JsleeeTMABtDRENGEffqnUEghjV-YjYMPbmh-le4mPYU5RG0OJe0x8IhNRwAcFo1wZJbEX_OrwRhOuAcaBata11V8UMOlK-j1nylaktIK6SdMioD-bnfFAvaogJHMD-rAYyJ1XsZcCxQ3sUpSiCzvK_W2tkCfTlHGpD7bVClc8tiBhgw_Ni_55KOm_5s_k_eQMsCm820kcmx7hfHq7jfyEEyOGSbFiIWFRiyKKPkQ8F72QayNHGqXtGMzph-TNdkSpwkkgP0gqZd3sgsQ4ucO6awwRTkXHkQ5S3KvEFgORV02zn1yrXWZtfeed3uGZL-rHA-acgWiuaO7S7Y4IJ1TQgHIdG2-6AAeK1QnxW35GpIK6dUa7-OhialYdOU7JUWq-X4JOXPiB8a6VOPDn8-kO9CXp5z6LyTPXPfBtXH_U8wcQ1KfnTRIfIgs6JAliCnV1JOry71UH65DTgxxxiadHfLKxsKkTehVoH_C7)

---

## **Begrænsninger**
- API-nøgler er fjernet, og tjenester som Google Maps og SQL-database vil derfor ikke fungere uden korrekt konfiguration.
- Databasen skal manuelt sættes op for at muliggøre CRUD-operationer.
- At bruge applikationen er dog ikke muligt lokalt, uden gyldigt login og dermed en authenticated session
---

## **Kompatibilitet**
Applikationen er testet i følgende miljøer:
- Windows 10/11
- Linux (Debian og Ubuntu)

---

## **Credits**
- **Udviklere**: Abeer Ul-Haq Khan & Daniel B. Roldgaard
- **Projekt**:Computerneværk og distribuerede systemer, HA(IT) 3. semester - Vinter 2024

---

## **Licens**
Dette projekt er underlagt MIT-licensen.

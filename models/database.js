var mysql = require('mysql2');

DB_HOST='localhost';
DB_USER='adix';
DB_PASSWORD='adix';
DB_DATABASE='projectwwwdb';

const db = mysql.createConnection({
    host:  DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    charset: 'utf8mb4'
})

var queryCreate= 'CREATE TABLE IF NOT EXISTS users (\
    id INT AUTO_INCREMENT PRIMARY KEY,\
    firstName varchar(255),\
    lastName varchar(255),\
    email varchar(255) UNIQUE,\
    hashedPassword BLOB,\
    salt BLOB\
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;'



db.query(queryCreate, (err, data) => {
    if (err) throw err;
    return;
});

queryCreate= 'CREATE TABLE IF NOT EXISTS books (\
	id INT AUTO_INCREMENT PRIMARY KEY,\
    bookTitle varchar(255) UNIQUE,\
    bookAuthor varchar(255),\
    bookGenre varchar(255),\
    bookCover varchar(255),\
    bookDescription text\
);'

db.query(queryCreate, (err, data) => {
    if (err) throw err;
    return;
});

queryCreate= 'CREATE TABLE IF NOT EXISTS user_library (\
	id INT AUTO_INCREMENT PRIMARY KEY,\
    userID INT,\
    bookID INT,\
    pagesNumber SMALLINT,\
    dateAdded DATETIME,\
    FOREIGN KEY(userID) REFERENCES users(id),\
    FOREIGN KEY(bookID) REFERENCES books(id)\
);'

db.query(queryCreate, (err, data) => {
    if (err) throw err;
    return;
});

var queryBook='INSERT INTO books (bookTitle, bookAuthor, bookGenre, bookCover, bookDescription)\
VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE bookTitle=bookTitle;';


const descriptions = ["Napisana w zachwycającym stylu jedyna powieść Oscara Wilde’a.\n" +
" Historia młodzieńca, który sprzedał duszę w zamian za wieczną młodość i piękno."+
" Gdy spotyka na swej drodze cynicznego bywalca salonów Henryka, znajomość ta nie pozostaje bez wpływu na jego niewinną duszę. \n"+
" A kiedy urzeczony urodą chłopca malarz Bazyli Hallward maluje jego portret, Dorian wyraża życzenie, by na zawsze zachować piękno, jakie uchwycił portrecista.\n"+
" Od tej chwili każdy występek, każdy grzech, który wyrządza bliźnim, znajduje odzwierciedlenie w obrazie, sam Dorian jednak zachowuje niczym nieskażoną urodę. \n"+
" By zaspokoić własne potrzeby, bez skrupułów zaczyna ranić innych. Gdy powieść ujrzała światło dzienne w 1890 roku, wywoła skandal i przyczyniła się do ugruntowania reputacji poety jako pozbawionego moralności dandysa.",
"Andrzej Sapkowski, arcymistrz światowej fantasy, zaprasza do swojego Neverlandu i przedstawia uwielbianą przez czytelników i wychwalaną przez krytykę wiedźmińską sagę!\n"+
" Wiedźmiński kodeks stawia tę sprawę w sposób jednoznaczny: wiedźminowi smoka zabijać się nie godzi.\n"+
" To gatunek zagrożony wymarciem. Aczkolwiek w powszechnej opinii to gad najbardziej wredny.\n"+
" Na oszluzgi, widłogony i latawce kodeks polować przyzwala. Ale na smoki – nie.\n"+
" Wiedźmin Geralt przyłącza się jednak do zorganizowanej przez króla Niedamira wyprawy na smoka, który skrył się w jaskiniach Gór Pustulskich.\n"+
" Na swej drodze spotyka trubadura Jaskra oraz – jakżeby inaczej – czarodziejkę Yennefer.\n"+
" Wśród zaproszonych przez króla co sławniejszych smokobójców jest Eyck z Denesle, rycerz bez skazy i zmazy, Rębacze z Cinfrid i szóstka krasnoludów pod komendą Yarpena Zigrina.\n"+
" Motywacje są różne, ale cel jeden. Smok nie ma szans.",
"Wiele lat temu w trakcie licealnej imprezy w Żeromicach doszło do tragedii – dwoje nastolatków spłonęło w starym, porzuconym pustostanie.\n"+
" Sprawa została zakwalifikowana jako wypadek i odcisnęła się na lokalnej społeczności tak silnym piętnem, że nikt do niej nie wraca.\n"+
" Do czasu.Pewnego dnia w okolicy bowiem odnajduje się zwęglone ciało, które sprawia wrażenie, jakby zostało wyniesione z dawnych zgliszczy i przeniesione w czasie.\n"+
" Czy należy do jednej z rzekomych ofiar? A jeśli tak, to jakim cudem ta wówczas przeżyła? I kto po tylu latach zamordował ją w tak upiorny sposób?",
"Harry znów spędza nudne, samotne wakacje w domu Dursleyów.\n"+
" Czeka go piąty rok nauki w Hogwarcie i chciałby jak najszybciej spotkać się ze swoimi najlepszymi przyjaciółmi, Ronem i Hermioną.\n"+
" Ci jednak wyraźnie go zaniedbują. Gdy Harry ma już dość wszystkiego i postanawia zmienić swoją nieznośną sytuację, sprawy przyjmują całkiem nieoczekiwany obrót.",
"Władca Pierścieni to jedna z najbardziej niezwykłych książek w całej współczesnej literaturze.\n"+
" Ogromna, z epickim rozmachem napisana powieść wprowadza nas w wykreowany przez wyobraźnię autora świat - fantastyczny, lecz ukazany wszechstronnie i szczegółowo, równie pełny i bogaty jak świat realny.\n"+
" Przykuwająca uwagę i wzruszająca, zabawna, choć momentami także przerażająca, opowieść ta rzuca na czytelnika czar, od którego nawet po zakończeniu lektury trudno się uwolnić.\n"+
" W ciągu pięćdziesięciu przeszło lat od pierwszego wydania Władcy Pierścieni miliony ludzi na całym świecie uległy temu urokowi.",
"Besteseller New York Timesa. Ponad 4 miliony sprzedanych egzemplarzy na świecie.\n"+
" David Goggins jest człowiekiem o żelaznej woli i inspiracją dla wszystkich. Samo słuchanie tego faceta sprawia, że chce się wbiec na jakąś górę.\n"+
" Jestem przekonany, że ludzie tacy jak on mogą zmieniać losy świata. Dzięki nim zaczynamy działać z determinacją i głęboką wiarą w siebie we wszystkim, co robimy.\n"+
" Jego cel, by stać się niezwykłym wśród niezwykłych, to idea, którą może wykorzystać każdy z nas, by odnaleźć w sobie siłę i w pełni wykorzystać swój potencjał.\n"+
" Spotkanie z nim sprawiło, że stałem się lepszym człowiekiem.",
"Mieszkaniec Derry, Ralph Roberts, nie radzi sobie z życiem po śmierci ukochanej żony.\n"+
" Nie ma się z kim dzielić rozpaczą, coraz częściej myśli o śmierci i cierpi na… bezsenność.\n"+
" Im mniej sypia, tym inaczej postrzega świat. A w końcu zaczyna widzieć dziwne aury otaczające żywe istoty.\n"+
" Może go to doprowadzić do szaleństwa, ale może też nadać sens jego egzystencji.\n"+
" Kiedy nocami chodzi po ulicach miasteczka, zdaje sobie sprawę, że brak snu nie jest największym z jego problemów.\n"+
" Bo do Derry wróciło Zło.",
"W Holly ekscentryczna śledcza musi zmierzyć się z parą genialnych, ale okrutnych przeciwników, którzy swoje tajemnice potrafią ukrywać jak nikt inny.\n"+
" Gdy Penny Dahl zwraca się do agencji Uczciwi Znalazcy z prośbą o pomoc w odnalezieniu jej zaginionej córki, Holly Gibney nie ma ochoty brać jej sprawy na swoje barki.\n"+
" Detektywka znajduje się w ciężkiej sytuacji – jej partner Peter jest ciężko chory, a poza tym niedawno zmarła jej matka, z którą wiązała ją skomplikowana relacja.\n"+
" Odpuściłaby tę sprawę, gdyby nie to coś w głosie zdesperowanej klientki. Coś, co nie pozwala jej odmówić i zmusza do wyruszenia na poszukiwania sprawcy.",
"Ekskluzywna biografia twórcy firmy Apple - Steve`a Jobsa (jedyna napisana przy jego współpracy)pióra Waltera Isaacsona, autora bestsellerowych biografii Benjamina Franklina i Alberta Einsteina. ",
"Nowa biografia autora bestsellerów „Steve Jobs”, „Leonardo da Vinci”, „Innowatorzy” i „Kod życia”.\n"+
" Elon Musk to zdumiewająco intymna historia najbardziej fascynującego i kontrowersyjnego innowatora naszych czasów – łamiącego zasady wizjonera, który wprowadził świat w erę pojazdów elektrycznych, prywatnej eksploracji kosmosu i sztucznej inteligencji.\n"+
" A, no i przejął Twittera. ",
"Lalka Bolesława Prusa to utwór wyjątkowy, od momentu ukazania się na łamach „Kuriera Codziennego” budzący kontrowersje, ale też podziw.\n"+
" Zawikłana, pełna niedopowiedzeń historia źle ulokowanych uczuć, straconych złudzeń i zaprzepaszczonych możliwości.\n"+
" Jedyna w swoim rodzaju konfrontacja romantycznego i pozytywistycznego idealizmu z realizmem.Bohaterem Lalki jest Stanisław Wokulski, człowiek o dwóch obliczach.\n"+
" Z jednej strony mocno stąpający po ziemi racjonalista, z drugiej romantycznie zakochany idealista.\n"+
" Ona zaś , Izabela Łęcka, typowa kobieta swej epoki, oddzielona murem konwenansów od prawdziwych uczuć, jednak tych uczuć spragniona.",
"Kontynuacja bestsellerowego Projektu Riese! Parker budzi się w innym, nieznanym mu świecie, nie mając pojęcia, jak się do niego dostał.\n"+
" Tutejsza Natalia nie przypomina jego Nataszy, on sam zaś zostaje wrzucony w życie innej wersji siebie – życie, którego nie zna, i z którym nie chce mieć nic wspólnego.\n"+
"Zaczyna poszukiwać drogi powrotnej do znanej mu rzeczywistości, podczas gdy Natasza robi wszystko, by go odnaleźć.\n"+
" Napotyka jednak w tunelach Kompleksu Riese osoby, które nie powinny się tam znajdować. A zaraz potem cały świat obraca się w entropiczny chaos…",
"Opowieść o bohaterach Szarych Szeregów – Rudym, Alku, Zośce, zilustrowana ponad osiemdziesięcioma zdjęciami ze wszystkich epok Ich życia – od gniazda rodzinnego, poprzez czas harcerstwa, miłości, walki, po dni ostatnie.\n"+
" Wydanie wzbogacone zdjęciami młodzieży z drużyn i szkół noszących imiona Janka Bytnara – Rudego, Alka Dawidowskiego, Tadeusza Zawadzkiego – Zośki, Aleksandra Kamińskiego – Kamyka.Edycja poprzedzona jest wstępem Barbary Wachowicz, autorki sławnej wystawy „Kamyk na szańcu” i cyklu „Wierna rzeka harcerstwa”.\n"+
" We wstępie znalazły się fragmenty nieznanego pamiętnika Druha Aleksandra Kamińskiego i jego list, jedyny, w którym mówi, jak stworzył „Kamienie na szaniec”, a także niezwykła korespondencja Basi i Alka, wspomnienia Matki i Siostry Rudego, pasjonujące relacje przyjaciół i towarzyszy broni. ",
"„Mistrz i Małgorzata” to fascynujący i ponadczasowy obraz walki dobra i zła. Woland, Behemot, Małgorzata są bohaterami wielobarwnymi, z którymi można się utożsamiać. Powieść bawi, wzrusza, zaskakuje i skłania do refleksji filozoficznych.\n"+
" Bułhakow doskonale splótł historię miłości pisarza, zwanego Mistrzem, i Małgorzaty Nikołajewny z ponurymi i zarazem groteskowymi realiami Rosji z lat trzydziestych XX wieku.\n"+
" Wątek z historią Poncjusza Piłata skazującego na śmierć wędrownego filozofa Jeszuę Ha-Nocri stanowi jednocześnie powieść w powieści.",
"Metaforyczny obraz świata walczącego ze złem, którego symbolem jest tytułowa dżuma, pustosząca Oran w 194… roku.\n"+
" Wybuch epidemii wywołuje różne reakcje u mieszkańców, jednak stopniowo uznają słuszność postępowania doktora Rieux, który od początku aktywnie walczy z zarazą, uznając to za swój obowiązek jako człowieka i lekarza.",
"Wielki brat patrzy – to właśnie napisy tej treści, w antyutopii Orwella krzyczące z plakatów rozlepionych po całym Londynie, natchnęły twórców telewizyjnego show „Big Brother”.\n"+
" Czyżby wraz z upadkiem komunizmu wielka, oskarżycielska powieść straciła swoją rację bytu, stając się zaledwie inspiracją programu rozrywkowego? Nie.\n"+
" Bo ukazuje świat, który zawsze może powrócić. Świat pustych sklepów, permanentnej wojny, jednej wiary. Klaustrofobiczny świat Wielkiego Brata, w którym każda sekunda ludzkiego życia znajduje się pod kontrolą, a dominującym uczuciem jest strach.\n"+
" Świat, w którym ludzie czują się bezradni i samotni, miłość uchodzi za zbrodnię, a takie pojęcie jak „wolność” i „sprawiedliwość” nie istnieją. Na świecie są miejsca, gdzie ten stan wciąż trwa.\n"+
" I zawsze znajdą się „cudotwórcy” gotowi obiecywać stworzenie nowego ładu, który od wizji Orwella dzieli tylko krok. Niestety, piekło wybrukowane jest dobrymi chęciami…"
]

db.query(queryBook, [
    'Portret Doriana Graya',
    'Oscar Wilde',
    'Fikcja gotycka',
    'images/portret_doriana_graya.jpg',
    descriptions[0]
], (err, rows, fields) => {
if (err) console.log(err);
});

db.query(queryBook, [
    'Wiedźmin: Miecz Przeznaczenia',
    'Andrzej Sapkowski',
    'Fantasy',
    'images/wiedzmin_miecz_przeznaczenia.jpg',
    descriptions[1]
], (err, rows, fields) => {
if (err) console.log(err);
});

db.query(queryBook, [
    'Światła w popiołach',
    'Remigiusz Mróz',
    'Kryminał',
    'images/swiatla_w_popiolach.jpg',
    descriptions[2]
], (err, rows, fields) => {
if (err) console.log(err);
});

db.query(queryBook, [
    'Harry Potter i Zakon Feniksa',
    'J.K. Rowling',
    'Fantasy',
    'images/harry_potter_zakon_feniksa.jpg',
    descriptions[3]
], (err, rows, fields) => {
if (err) console.log(err);
});

db.query(queryBook, [
    'Władca Pierścieni',
    'J.R.R. Tolkien',
    'Fantasy',
    'images/wladca_pierscienia.jpg',
    descriptions[4]
], (err, rows, fields) => {
if (err) console.log(err);
});

db.query(queryBook, [
    'Nic mnie nie złamie',
    'David Goggins',
    'Rozwój osobisty',
    'images/nic_mnie_nie_zlamie.jpg',
    descriptions[5]
], (err, rows, fields) => {
if (err) console.log(err);
});

db.query(queryBook, [
    'Bezsenność',
    'Stephen King',
    'Horror',
    'images/bezsennosc.jpg',
    descriptions[6]
], (err, rows, fields) => {
if (err) console.log(err);
});

db.query(queryBook, [
    'Holly',
    'Stephen King',
    'Horror',
    'images/holly.jpg',
    descriptions[7]
], (err, rows, fields) => {
if (err) console.log(err);
});

db.query(queryBook, [
    'Steve Jobs',
    'Walter Isaacson',
    'Biografia',
    'images/steve_jobs.jpg',
    descriptions[8]
], (err, rows, fields) => {
if (err) console.log(err);
});

db.query(queryBook, [
    'Elon Musk',
    'Walter Isaacson',
    'Biografia',
    'images/elon_musk.jpg',
    descriptions[9]
], (err, rows, fields) => {
if (err) console.log(err);
});

db.query(queryBook, [
    'Lalka',
    'Bolesław Prus',
    'Powieść obyczajowa',
    'images/lalka.jpg',
    descriptions[10]
], (err, rows, fields) => {
if (err) console.log(err);
});

db.query(queryBook, [
    'Operacja MIR',
    'Remigiusz Mróz',
    'Kryminał',
    'images/operacja_mir.jpg',
    descriptions[11]
], (err, rows, fields) => {
if (err) console.log(err);
});

db.query(queryBook, [
    'Kamienie na szaniec',
    'Aleksander Kamiński',
    'Historia',
    'images/kamienie_na_szaniec.jpg',
    descriptions[12]
], (err, rows, fields) => {
if (err) console.log(err);
});

db.query(queryBook, [
    'Mistrz i Małgorzata',
    'Michaił Bułhakow',
    'Powieść',
    'images/mistrz_i_malgorzata.jpg',
    descriptions[13]
], (err, rows, fields) => {
if (err) console.log(err);
});

db.query(queryBook, [
    'Dżuma',
    'Albert Camus',
    'Powieść',
    'images/dzuma.jpg',
    descriptions[14]
], (err, rows, fields) => {
if (err) console.log(err);
});

db.query(queryBook, [
    'Rok 1984',
    'George Orwell',
    'Powieść dystopijna',
    'images/rok1984.jpg',
    descriptions[15]
], (err, rows, fields) => {
if (err) console.log(err);
});

module.exports = db;
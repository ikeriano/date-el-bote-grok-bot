// Preguntas de cultura general (3 opciones; la primera es la correcta). Datos reales.
const T = `¿Cuál es la capital de Portugal?|Lisboa|Oporto|Coímbra
¿Cuántos jugadores tiene un equipo de fútbol en el campo?|11|10|12
¿Qué planeta es conocido como el planeta rojo?|Marte|Júpiter|Venus
¿En qué ciudad está la Sagrada Familia?|Barcelona|Madrid|Valencia
¿Cuál es el río más largo de España?|Tajo|Ebro|Duero
¿Quién pintó «Las Meninas»?|Velázquez|Goya|El Greco
¿Cuántos lados tiene un hexágono?|6|5|8
¿Qué animal es el más grande del mundo?|La ballena azul|El elefante africano|El tiburón ballena
¿Cuál es el océano más grande?|Pacífico|Atlántico|Índico
¿En qué año llegó Colón a América?|1492|1512|1453
¿Cuál es la capital de Euskadi?|Vitoria-Gasteiz|Bilbao|San Sebastián
¿Qué gas respiramos para vivir?|Oxígeno|Nitrógeno|Helio
¿Quién escribió «Don Quijote de la Mancha»?|Miguel de Cervantes|Lope de Vega|Quevedo
¿Cuántos días tiene un año bisiesto?|366|365|364
¿Cuál es el metal cuyo símbolo químico es Au?|Oro|Plata|Aluminio
¿Qué instrumento tiene 88 teclas?|Piano|Órgano|Acordeón
¿Cuál es la montaña más alta del mundo?|Everest|K2|Kilimanjaro
¿En qué país están las pirámides de Guiza?|Egipto|México|Perú
¿Cuál es la capital de Italia?|Roma|Milán|Nápoles
¿Cuántos minutos tiene una hora?|60|100|50
¿Qué fruta es típica de las Islas Canarias?|El plátano|La piña|El kiwi
¿De qué color es la clorofila?|Verde|Roja|Azul
¿Cuál es el idioma oficial de Brasil?|Portugués|Español|Brasileño
¿Qué selección ganó el Mundial de fútbol de 2010?|España|Países Bajos|Alemania
¿Cuál es la capital de Francia?|París|Lyon|Marsella
¿Cuál es el hueso más largo del cuerpo humano?|El fémur|La tibia|El húmero
¿Cuántas patas tiene una araña?|8|6|10
¿Quién compuso «Las cuatro estaciones»?|Vivaldi|Mozart|Bach
¿Cuál es el desierto cálido más grande del mundo?|Sahara|Gobi|Atacama
¿En qué ciudad está el museo del Prado?|Madrid|Sevilla|Toledo
¿Qué científico formuló la teoría de la relatividad?|Albert Einstein|Isaac Newton|Galileo Galilei
¿Cuántos continentes se suelen contar en España?|5|4|7
¿Cuál es el plato típico valenciano con arroz?|La paella|El cocido|La fabada
¿Qué es el euskera?|Una lengua|Un baile|Un plato
¿Cuál es la capital de Alemania?|Berlín|Múnich|Fráncfort
¿Quién pintó el «Guernica»?|Picasso|Dalí|Miró
¿Qué animal pone huevos y es mamífero?|El ornitorrinco|El delfín|El murciélago
¿Cuántos colores tiene el arcoíris?|7|6|8
¿Qué ciudad es famosa por sus canales y góndolas?|Venecia|Florencia|Ámsterdam
¿Cuál es la moneda del Reino Unido?|La libra esterlina|El euro|El dólar
¿Qué deporte practica Rafa Nadal?|Tenis|Pádel|Golf
¿En qué ciudad está el Guggenheim que diseñó Frank Gehry?|Bilbao|Barcelona|Málaga
¿Cuál es el animal símbolo de Australia?|El canguro|El panda|El león
¿Cuál es el punto más alto de España?|El Teide|El Mulhacén|El Aneto
¿Cuántos años tiene un siglo?|100|1000|10
¿Qué órgano bombea la sangre?|El corazón|El hígado|El pulmón
¿Cuál es la capital de Japón?|Tokio|Kioto|Osaka
¿Quién fue el primer hombre en pisar la Luna?|Neil Armstrong|Buzz Aldrin|Yuri Gagarin
¿Qué famoso detective creó Arthur Conan Doyle?|Sherlock Holmes|Hércules Poirot|Maigret
¿De qué país es típico el sushi?|Japón|China|Tailandia
¿Cuál es el planeta más grande del sistema solar?|Júpiter|Saturno|Neptuno
¿Qué cantante es conocida como «la Faraona»?|Lola Flores|Rocío Jurado|Isabel Pantoja
¿Cuántas cuerdas tiene una guitarra española?|6|4|12
¿En qué comunidad autónoma está Santiago de Compostela?|Galicia|Asturias|Castilla y León
¿Cuál es el símbolo químico del agua?|H2O|CO2|O2
¿Qué día se celebra la Navidad?|25 de diciembre|6 de enero|31 de diciembre
¿Cuál es la capital de Argentina?|Buenos Aires|Córdoba|Rosario
¿Qué selección ganó la Eurocopa de 2024?|España|Inglaterra|Francia
¿Cómo se llama el idioma oficial de China?|Chino mandarín|Cantonés|Japonés
¿Cuántas horas tiene un día?|24|12|48
¿Qué escritor creó a Harry Potter?|J. K. Rowling|Roald Dahl|Tolkien
¿Qué pieza del ajedrez solo se mueve en diagonal?|El alfil|La torre|El caballo
¿Cuál es el país más grande del mundo?|Rusia|Canadá|China
¿En qué ciudad se celebran los Sanfermines?|Pamplona|Logroño|Burgos
¿Qué tipo de animal es la orca?|Un mamífero|Un pez|Un reptil
¿Cuál es la capital de Marruecos?|Rabat|Casablanca|Marrakech
¿Quién fue el autor de «La casa de Bernarda Alba»?|Federico García Lorca|Antonio Machado|Valle-Inclán
¿Cuál es el satélite natural de la Tierra?|La Luna|Fobos|Titán
¿Qué número romano es la L?|50|100|500
¿Cuál es la capital de Navarra?|Pamplona|Tudela|Estella
¿Cuántos jugadores hay en un equipo de baloncesto en pista?|5|6|7
¿Qué animal es Rayo McQueen?|Un coche|Un caballo|Un perro
¿Quién descubrió la penicilina?|Alexander Fleming|Louis Pasteur|Marie Curie
¿Cuál es el ave que no vuela y vive en la Antártida?|El pingüino|El avestruz|El kiwi
¿Qué cordillera separa España de Francia?|Los Pirineos|Los Alpes|Sierra Nevada
¿Qué planeta tiene unos anillos muy famosos?|Saturno|Marte|Mercurio
¿Cuál es la capital de Cantabria?|Santander|Torrelavega|Laredo
¿En qué deporte se usa un «tee»?|Golf|Tenis|Béisbol
¿Cuántos ceros tiene un millón?|6|5|9
¿Qué pintor se cortó parte de una oreja?|Van Gogh|Monet|Rembrandt
¿Qué selección ha ganado más Mundiales de fútbol?|Brasil|Alemania|Italia
¿Qué ciudad española es famosa por la Alhambra?|Granada|Córdoba|Sevilla
¿Cuál es el animal más rápido en tierra?|El guepardo|El león|El caballo
¿De qué color es el caballo blanco de Santiago?|Blanco|Negro|Marrón
¿En qué continente está Kenia?|África|Asia|América
¿Qué famoso ratón creó Walt Disney?|Mickey Mouse|Jerry|Speedy González
¿Cuál es el único mamífero que puede volar?|El murciélago|La ardilla voladora|El colibrí
¿Qué es un haiku?|Un poema japonés|Un plato coreano|Un arte marcial
¿Cuántos huesos tiene aproximadamente un adulto?|206|150|300
¿Qué ciudad se conoce como «la ciudad que nunca duerme»?|Nueva York|Las Vegas|Tokio
¿Cuál es la lengua más hablada del mundo como lengua materna?|Chino mandarín|Inglés|Español
¿Qué famoso barco se hundió en 1912?|El Titanic|El Lusitania|El Britannic
¿Cuál es la capital de Andalucía?|Sevilla|Málaga|Granada
¿Qué metal es líquido a temperatura ambiente?|El mercurio|El plomo|El estaño
¿Qué futbolista es conocido como «La Pulga»?|Lionel Messi|Andrés Iniesta|Neymar
¿Qué se celebra el 6 de enero en España?|Los Reyes Magos|La Constitución|La Hispanidad
¿Cuántos meses tienen 31 días?|7|6|5
¿Cómo se llama el famoso reloj de Londres?|Big Ben|Tower Clock|Royal Time
¿Quién fue la primera cantante de La Oreja de Van Gogh?|Amaia Montero|Leire Martínez|Amaia Romero
¿Cuál es la comida típica de Asturias con alubias?|La fabada|El pisto|El gazpacho
¿Qué científica ganó dos premios Nobel?|Marie Curie|Rosalind Franklin|Ada Lovelace
¿En qué año se celebraron los Juegos Olímpicos de Barcelona?|1992|1988|1996
¿Qué animal es Bambi?|Un ciervo|Un conejo|Un zorro
¿Cuál es el mar que baña Valencia?|El Mediterráneo|El Cantábrico|El Atlántico
¿Qué es la Moncloa?|La sede de la Presidencia del Gobierno|El palacio del Rey|El Senado
¿Cuántas estrellas tiene la bandera de la Unión Europea?|12|15|27
¿Quién canta «Despechá»?|Rosalía|Aitana|Lola Índigo
¿Qué cantante ganó Eurovisión con «Waterloo»?|ABBA|Massiel|Céline Dion
¿Qué país tiene forma de bota?|Italia|Grecia|Chile
¿Qué fruto seco se usa para hacer el turrón de Jijona?|Almendra|Nuez|Avellana
¿Cuál es la capital de Galicia?|Santiago de Compostela|A Coruña|Vigo
¿Qué vitamina nos da el sol?|Vitamina D|Vitamina C|Vitamina A
¿Cómo se llama el ayudante de Don Quijote?|Sancho Panza|Lazarillo|Rocinante
¿Cuántos puntos vale un triple en baloncesto?|3|2|4
¿Qué ciudad vasca tiene la playa de La Concha?|San Sebastián|Bilbao|Getxo
¿Qué océano baña la costa de Cádiz?|Atlántico|Índico|Ártico`;
export const CULTURA = T.split('\n').map(l => { const [q, ok, m1, m2] = l.split('|'); return { q, ok, ops: [ok, m1, m2] }; });

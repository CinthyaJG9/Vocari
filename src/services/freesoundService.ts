    const FREESOUND_CLIENT_ID = 'lyLoOMS0jN73ttBVLAY4';
    const FREESOUND_API_KEY = 'i6PVdwbtU4TYVoWpe2JSTH4mlXKIZ1CVgV7SYrhs';


    const API_BASE = 'https://freesound.org/apiv2';
    const soundCache = new Map<string, string>();

    // Sonidos predefinidos con queries optimizadas
    export const soundActivities = [
    { soundQuery: "dog bark short", image: "dog", text: "Perro" },
    { soundQuery: "cat meow short", image: "cat", text: "Gato" },
    { soundQuery: "cow moo", image: "cow", text: "Vaca" },
    { soundQuery: "bird chirp", image: "bird", text: "Pájaro" },
    { soundQuery: "frog croak", image: "frog", text: "Rana" },
    { soundQuery: "sheep baa", image: "sheep", text: "Oveja" },
    { soundQuery: "monkey scream", image: "monkey", text: "Mono" },
    { soundQuery: "lion roar ", image: "lion", text: "León" },
    { soundQuery: "rain drops", image: "rain", text: "Lluvia" },
    { soundQuery: "thunder rumble", image: "thunder", text: "Trueno" },
    { soundQuery: "fire truck siren", image: "firetruck", text: "Camión de bomberos" },
    { soundQuery: "car horn beep", image: "car", text: "Coche" },
        { soundQuery: "butterfly wings", image: "butterfly", text: "Mariposa" },
        { soundQuery: "telescope", image: "telescope", text: "Telescopio" },
        { soundQuery: "architect ", image: "architect", text: "Arquitecto" },
        { soundQuery: "library ", image: "library", text: "Biblioteca" },
        { soundQuery: "computer keyboard", image: "computer", text: "Computadora" },
        { soundQuery: "astronaut space", image: "astronaut", text: "Astronauta" },
        { soundQuery: "violin short note", image: "violin", text: "Violín" },
        { soundQuery: "chocolate wrapper", image: "chocolate", text: "Chocolate" },
        { soundQuery: "horse neigh short", image: "horse", text: "Caballo" },
        { soundQuery: "duck quack short", image: "duck", text: "Pato" },
        { soundQuery: "bee buzz short", image: "bee", text: "Abeja" },
        { soundQuery: "elephant trumpet", image: "elephant", text: "Elefante" },
        { soundQuery: "astronaut space", image: "astronaut", text: "Astronauta" },
        { soundQuery: "violin short note", image: "violin", text: "Violín" },
        { soundQuery: "chocolate wrapper", image: "chocolate", text: "Chocolate" },
        { soundQuery: "horse neigh short", image: "horse", text: "Caballo" },
        { soundQuery: "duck quack short", image: "duck", text: "Pato" },
        { soundQuery: "bee buzz short", image: "bee", text: "Abeja" },
        { soundQuery: "elephant", image: "elephant", text: "Elefante" },
        { soundQuery: "giraffe call", image: "giraffe", text: "Jirafa" },
        { soundQuery: "zebra neigh", image: "zebra", text: "Cebra" },
        { soundQuery: "tiger growl", image: "tiger", text: "Tigre" },
        { soundQuery: "bear growl", image: "bear", text: "Oso" },
        {soundQuery: "library ambience", image: "library", text: "Biblioteca" },
        {soundQuery: "computer keyboard", image: "computer", text: "Computadora" },
        {soundQuery: "astronaut space", image: "astronaut", text: "Astronauta" },
        {soundQuery: "violin short note", image: "violin", text: "Violín" },
        {soundQuery: "chocolate wrapper", image: "chocolate", text: "Chocolate" },
        {soundQuery: "horse neigh short", image: "horse", text: "Caballo" },
        {soundQuery: "duck quack short", image: "duck", text: "Pato" },
        {soundQuery: "bee buzz short", image: "bee", text: "Abeja" },
        {soundQuery: "elephant ", image: "elephant", text: "Elefante" },
        {soundQuery: "giraffe call", image: "giraffe", text: "Jirafa" },
        {soundQuery: "zebra neigh", image: "zebra", text: "Cebra" },
        {soundQuery: "tiger growl", image: "tiger", text: "Tigre" },
        {soundQuery: "bear growl", image: "bear", text: "Oso" },
        {soundQuery: "snake hiss", image: "snake", text: "Serpiente" },
        {soundQuery: "whale song", image: "whale", text: "Ballena" },
        {soundQuery: "dolphin click", image: "dolphin", text: "Delfín" },
        {soundQuery: "shark", image: "shark", text: "Tiburón" },
        {soundQuery: "octopus", image: "octopus", text: "Pulpo" },
        {soundQuery: "castle", image: "castle", text: "Castillo" },
        {soundQuery: "robot", image: "robot", text: "Robot" },
        {soundQuery: "pizza", image: "pizza", text: "Pizza" },
        {soundQuery: "ice cream", image: "icecream", text: "Helado" },
        {soundQuery: "balloon pop", image: "balloon", text: "Globo" },
    ];

    // Buscar sonido en Freesound
    export const searchSound = async (query: string): Promise<string | null> => {
    if (soundCache.has(query)) {
        return soundCache.get(query)!;
    }
    
    try {
        // Buscar sonidos cortos (duración máxima 5 segundos)
        const searchUrl = `${API_BASE}/search/text/?query=${encodeURIComponent(query)}&token=${FREESOUND_API_KEY}&fields=previews,duration&page_size=5&filter=duration:[0 TO 5]`;
        
        const response = await fetch(searchUrl);
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
        // Encontrar un sonido de menos de 5 segundos
        const shortSound = data.results.find((s: any) => s.duration <= 5);
        const soundToUse = shortSound || data.results[0];
        const soundUrl = soundToUse.previews['preview-hq-mp3'];
        
        if (soundUrl) {
            soundCache.set(query, soundUrl);
            return soundUrl;
        }
        }
        return null;
    } catch (error) {
        console.error("Error buscando sonido:", error);
        return null;
    }
    };

    // Reproducir sonido con timeout máximo de 5 segundos
    export const playSound = (soundUrl: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        const audio = new Audio(soundUrl);    
        let timeoutId: ReturnType<typeof setTimeout>;
        
        // Limitar reproducción a 5 segundos máximo
        const stopSound = () => {
        audio.pause();
        audio.currentTime = 0;
        clearTimeout(timeoutId);
        };
        
        audio.onended = () => {
        clearTimeout(timeoutId);
        resolve();
        };
        
        audio.onerror = (e) => {
        clearTimeout(timeoutId);
        console.error("Error reproduciendo sonido:", e);
        reject();
        };
        
        // Si el sonido dura más de 5 segundos, lo cortamos
        timeoutId = setTimeout(() => {
        stopSound();
        resolve();
        }, 5000);
        
        audio.play().catch(reject);
    });
    };

    // Buscar y reproducir sonido
    export const playSoundByQuery = async (query: string): Promise<boolean> => {
    try {
        const soundUrl = await searchSound(query);
        if (soundUrl) {
        await playSound(soundUrl);
        return true;
        }
        return false;
    } catch (error) {
        console.error("Error:", error);
        return false;
    }
    };
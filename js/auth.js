/* ===================================================================
   FINZY — Autenticación con Supabase
   =================================================================== */

async function requireAuth() {
    const { data: { user } } = await _supabase.auth.getUser();
    if (!user) {
        window.location.href = 'index.html';
        return null;
    }
    return user;
}

// Obtener nombre del usuario desde metadata
async function getUserName() {
    const { data: { user } } = await _supabase.auth.getUser();
    if (!user) return 'tú';
    return user.user_metadata?.full_name || user.email?.split('@')[0] || 'tú';
}

// Registrar nuevo usuario con nombre completo y teléfono
async function register(email, password, fullName, phone) {
    const { data, error } = await _supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
                phone: phone
            }
        }
    });
    if (error) throw error;
    return data;
}

// Iniciar sesión
async function login(email, password) {
    const { data, error } = await _supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
}

// Cerrar sesión
async function logout() {
    await _supabase.auth.signOut();
    window.location.href = 'index.html';
}

// Cargar nombre en sidebar — llamar en cada página interna
async function loadUserInSidebar() {
    const name = await getUserName();
    const nameEl = document.getElementById('userName');
    const avatarEl = document.getElementById('userAvatar');
    if (nameEl) nameEl.textContent = name;
    if (avatarEl) avatarEl.textContent = name.charAt(0).toUpperCase();
}

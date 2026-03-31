import { create } from 'zustand';

type Language = 'en' | 'id';

interface LanguageStore {
  language: Language;
  setLanguage: (lang: Language) => void;
}

// Simple store without persist for now (can add persist later if needed)
export const useLanguageStore = create<LanguageStore>((set) => ({
  language: 'en',
  setLanguage: (lang) => set({ language: lang }),
}));

export const translations = {
  en: {
    // Navigation
    home: 'Home',
    brainstorm: 'Brainstorm',
    create: 'Create with AI',
    community: 'Community',
    profile: 'Profile',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    signOut: 'Sign Out',
    
    // Landing Page
    heroTitle: 'Where Ideas Become Reality',
    heroSubtitle: 'Break free from creative blocks. Generate truly original concepts with AI, share with the community, and connect with investors.',
    getStarted: 'Get Started',
    learnMore: 'Learn More',
    
    feature1Title: 'AI-Powered Brainstorming',
    feature1Desc: 'Get inspired with intelligent suggestions and creative frameworks',
    
    feature2Title: 'Original Concept Generator',
    feature2Desc: 'Multi-model AI synthesis ensures your ideas are truly unique',
    
    feature3Title: 'Community & Funding',
    feature3Desc: 'Share your concepts, get validated, and connect with investors',
    
    // Brainstorm
    brainstormTitle: 'Start Your Creative Journey',
    brainstormPlaceholder: 'Describe your idea... (e.g., "A time travel story about economics")',
    brainstormButton: 'Get Inspiration',
    proceedToCreate: 'Proceed to AI Creator',
    
    // AI Creator
    createTitle: 'AI Creativity Engine',
    createSubtitle: 'Generate truly original concepts',
    seedIdea: 'Your Seed Idea',
    category: 'Category',
    selectCategory: 'Select category',
    story: 'Story',
    game: 'Game',
    business: 'Business',
    tech: 'Technology',
    art: 'Art',
    generateConcept: 'Generate Concept',
    generating: 'Generating...',
    noveltyScore: 'Originality Score',
    saveAndPublish: 'Save & Publish',
    regenerate: 'Regenerate',
    
    // Community
    communityTitle: 'Discover Creative Concepts',
    allProjects: 'All Projects',
    trending: 'Trending',
    newest: 'Newest',
    searchPlaceholder: 'Search projects...',
    upvotes: 'upvotes',
    comments: 'comments',
    views: 'views',
    
    // Project Detail
    generatedWith: 'Generated with AI',
    originalityScore: 'Originality',
    shareProject: 'Share',
    editProject: 'Edit',
    deleteProject: 'Delete',
    addComment: 'Add a comment...',
    postComment: 'Post',
    
    // Auth
    email: 'Email',
    password: 'Password',
    username: 'Username',
    fullName: 'Full Name',
    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount: "Don't have an account?",
    
    // Messages
    loginSuccess: 'Successfully logged in!',
    loginError: 'Login failed. Please check your credentials.',
    signupSuccess: 'Account created! Please check your email.',
    signupError: 'Signup failed. Please try again.',
    projectSaved: 'Project saved successfully!',
    projectPublished: 'Project published to community!',
    voteCasted: 'Vote recorded!',
    commentPosted: 'Comment posted!',
    
    // Common
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    publish: 'Publish',
    draft: 'Draft',
    by: 'by',
  },
  id: {
    // Navigation
    home: 'Beranda',
    brainstorm: 'Brainstorm',
    create: 'Buat dengan AI',
    community: 'Komunitas',
    profile: 'Profil',
    signIn: 'Masuk',
    signUp: 'Daftar',
    signOut: 'Keluar',
    
    // Landing Page
    heroTitle: 'Dimana Ide Menjadi Kenyataan',
    heroSubtitle: 'Lepas dari kebuntuan kreatif. Hasilkan konsep yang benar-benar original dengan AI, bagikan ke komunitas, dan hubungkan dengan investor.',
    getStarted: 'Mulai Sekarang',
    learnMore: 'Pelajari Lebih Lanjut',
    
    feature1Title: 'Brainstorming Bertenaga AI',
    feature1Desc: 'Dapatkan inspirasi dengan saran cerdas dan framework kreatif',
    
    feature2Title: 'Generator Konsep Original',
    feature2Desc: 'Sintesis multi-model AI memastikan ide kamu benar-benar unik',
    
    feature3Title: 'Komunitas & Pendanaan',
    feature3Desc: 'Bagikan konsepmu, dapatkan validasi, dan hubungkan dengan investor',
    
    // Brainstorm
    brainstormTitle: 'Mulai Perjalanan Kreatifmu',
    brainstormPlaceholder: 'Deskripsikan idemu... (contoh: "Cerita time travel tentang ekonomi")',
    brainstormButton: 'Dapatkan Inspirasi',
    proceedToCreate: 'Lanjut ke AI Creator',
    
    // AI Creator
    createTitle: 'Mesin Kreativitas AI',
    createSubtitle: 'Hasilkan konsep yang benar-benar original',
    seedIdea: 'Ide Awalmu',
    category: 'Kategori',
    selectCategory: 'Pilih kategori',
    story: 'Cerita',
    game: 'Game',
    business: 'Bisnis',
    tech: 'Teknologi',
    art: 'Seni',
    generateConcept: 'Hasilkan Konsep',
    generating: 'Menghasilkan...',
    noveltyScore: 'Skor Originalitas',
    saveAndPublish: 'Simpan & Publikasikan',
    regenerate: 'Hasilkan Ulang',
    
    // Community
    communityTitle: 'Temukan Konsep Kreatif',
    allProjects: 'Semua Proyek',
    trending: 'Trending',
    newest: 'Terbaru',
    searchPlaceholder: 'Cari proyek...',
    upvotes: 'upvote',
    comments: 'komentar',
    views: 'dilihat',
    
    // Project Detail
    generatedWith: 'Dibuat dengan AI',
    originalityScore: 'Originalitas',
    shareProject: 'Bagikan',
    editProject: 'Edit',
    deleteProject: 'Hapus',
    addComment: 'Tambahkan komentar...',
    postComment: 'Kirim',
    
    // Auth
    email: 'Email',
    password: 'Password',
    username: 'Username',
    fullName: 'Nama Lengkap',
    alreadyHaveAccount: 'Sudah punya akun?',
    dontHaveAccount: 'Belum punya akun?',
    
    // Messages
    loginSuccess: 'Berhasil masuk!',
    loginError: 'Login gagal. Periksa kredensial kamu.',
    signupSuccess: 'Akun dibuat! Silakan cek email kamu.',
    signupError: 'Pendaftaran gagal. Coba lagi.',
    projectSaved: 'Proyek berhasil disimpan!',
    projectPublished: 'Proyek dipublikasikan ke komunitas!',
    voteCasted: 'Vote tercatat!',
    commentPosted: 'Komentar terkirim!',
    
    // Common
    loading: 'Memuat...',
    error: 'Error',
    success: 'Berhasil',
    cancel: 'Batal',
    save: 'Simpan',
    delete: 'Hapus',
    edit: 'Edit',
    publish: 'Publikasikan',
    draft: 'Draft',
    by: 'oleh',
  },
};

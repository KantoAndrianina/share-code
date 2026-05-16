// HomePage.tsx
// Route : /
//
// Affiche le hero, les films récents de la bibliothèque, et les mini KPIs.
// Les données réelles seront branchées par le membre C via TanStack Query.
// En attendant, des données mockées permettent de valider le rendu.
//
// Dépendances :
//   - HomePage.module.css
//   - global.css (classes .content, .movies-grid, .movie-card, .section-label…)
//   - Button.module.css
//   - React Router (useNavigate)
//   - Badge.module.css (statuts sur les posters)
//   - Membre C : useLibrary() pour remplacer MOCK_RECENT_FILMS

import { useNavigate } from 'react-router-dom';
import s from '../styles/pages/HomePage.module.css';
import btn from '../styles/components/Button.module.css';
import bdg from '../styles/components/Badge.module.css';

import { LibraryStatus } from '@/types';
import { useToast } from '../hooks/useToast';

interface RecentFilm {
  tmdbId: number;
  title: string;
  year: number;
  rating: number; // note TMDB
  status?: LibraryStatus;
}

interface StatsKpi {
  filmsSeen: number;
  hoursWatched: number;
  avgRating: number;
}

// ── Données mockées ────────────────────────────────────────────────────────
// TODO membre C : remplacer par useQuery({ queryKey: ['library', 'recent'] })

const MOCK_RECENT_FILMS: RecentFilm[] = [
  { tmdbId: 693134, title: 'Dune: Part Two', year: 2024, rating: 8.5, status: 'watched' },
  { tmdbId: 872585, title: 'Oppenheimer', year: 2023, rating: 8.9, status: 'watched' },
  { tmdbId: 951546, title: 'Past Lives', year: 2023, rating: 7.8, status: 'to-watch' },
  { tmdbId: 792307, title: 'Poor Things', year: 2023, rating: 7.9 },
  { tmdbId: 466420, title: 'Killers of the Flower Moon', year: 2023, rating: 7.6 },
];

const MOCK_STATS: StatsKpi = {
  filmsSeen: 47,
  hoursWatched: 94,
  avgRating: 7.2,
};

// ── Sous-composants ────────────────────────────────────────────────────────

// Icône étoile SVG
function StarIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

// Icône film placeholder
function FilmIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      opacity="0.3"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="2" />
      <path d="M7 2v20M17 2v20M2 12h20M2 7h5M17 7h5M2 17h5M17 17h5" />
    </svg>
  );
}

// Icône plus
function PlusIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  );
}

// Labels lisibles pour les statuts
const STATUS_LABEL: Record<LibraryStatus, string> = {
  watched: 'Vu',
  'to-watch': 'À voir',
  watching: 'En cours',
  abandoned: 'Abandonné',
};

// Carte film individuelle
function MovieCard({ film, onClick }: { film: RecentFilm; onClick: () => void }) {
  return (
    <div
      className="movie-card"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      aria-label={`${film.title} (${film.year})`}
    >
      <div className="movie-poster">
        {/* TODO : remplacer par <img src={tmdbPosterUrl} alt={film.title} className="movie-poster-img" /> */}
        <div className="poster-placeholder">
          <FilmIcon />
          <span>{film.title}</span>
        </div>

        {/* Overlay statut au survol */}
        {film.status && (
          <div className="lib-card-overlay" aria-hidden="true">
            <span className={`${bdg.badge} ${bdg[film.status]}`}>{STATUS_LABEL[film.status]}</span>
          </div>
        )}
      </div>

      <div className="movie-card-info">
        <div className="movie-card-title">{film.title}</div>
        <div className="movie-card-meta">
          <span>{film.year}</span>
          <div className="movie-card-rating">
            <StarIcon />
            {film.rating.toFixed(1)}
          </div>
        </div>
      </div>
    </div>
  );
}

// Carte "ajouter un film"
function AddMovieCard({ onClick }: { onClick: () => void }) {
  return (
    <div
      className="movie-card"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      aria-label="Ajouter un film"
    >
      <div
        className="movie-poster"
        style={{
          border: '1px dashed var(--border)',
          background: 'transparent',
          cursor: 'pointer',
        }}
      >
        <div className="poster-placeholder" style={{ color: 'var(--accent)' }}>
          <PlusIcon />
          <span style={{ fontSize: '11px' }}>Ajouter un film</span>
        </div>
      </div>
    </div>
  );
}

// KPI individuel
interface KpiCardProps {
  label: string;
  value: string;
  sub: string;
}

function KpiCard({ label, value, sub }: KpiCardProps) {
  return (
    <div className={s.kpiCard}>
      <div className={s.kpiLabel}>{label}</div>
      <div className={s.kpiValue}>{value}</div>
      <div className={s.kpiSub}>{sub}</div>
    </div>
  );
}

// ── Page principale ────────────────────────────────────────────────────────

export default function HomePage() {
  const navigate = useNavigate();
  const toast = useToast();

  // TODO membre C :
  // const { data: recentFilms, isLoading } = useQuery({
  //   queryKey: ['library', 'recent'],
  //   queryFn:  () => libraryService.getRecent(6),
  // })
  // const { data: stats } = useQuery({
  //   queryKey: ['stats', 'summary'],
  //   queryFn:  statsService.getSummary,
  // })
  const recentFilms = MOCK_RECENT_FILMS;
  const stats = MOCK_STATS;

  return (
    <main>
      <div className="content">
        {/* ── Hero ── */}
        <section className={s.hero} aria-labelledby="hero-title">
          <span className={s.heroLabel}>Journal de visionnage</span>

          <h1 id="hero-title" className={s.heroTitle}>
            Votre cinéma,
            <br />
            <em>votre histoire.</em>
          </h1>

          <p className={s.heroDesc}>
            Suivez chaque film, notez vos impressions, découvrez vos habitudes de visionnage en un
            coup d'œil.
          </p>

          <div className={s.heroActions}>
            <button className={`${btn.btn} ${btn.primary}`} onClick={() => navigate('/search')}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              Explorer des films
            </button>

            <button className={`${btn.btn} ${btn.ghost}`} onClick={() => navigate('/library')}>
              Ma bibliothèque
            </button>
          </div>
        </section>
        {/* TEST TOAST — à supprimer après vérification */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button onClick={() => toast.success('Film ajouté ✓')}>Test success</button>
            <button onClick={() => toast.error('Connexion impossible')}>Test error</button>
            <button onClick={() => toast.info('Information')}>Test info</button>
          </div>

        {/* ── Films récents ── */}
        <section className={s.featuredSection} aria-labelledby="recent-title">
          <div className="section-label" id="recent-title">
            Ajoutés récemment
          </div>

          <div className="movies-grid">
            {recentFilms.map((film) => (
              <MovieCard
                key={film.tmdbId}
                film={film}
                onClick={() => navigate(`/movie/${film.tmdbId}`)}
              />
            ))}
            <AddMovieCard onClick={() => navigate('/search')} />
          </div>
        </section>

        {/* ── Mini KPIs ── */}
        <section className={s.kpiRow} aria-label="Résumé de vos statistiques">
          <KpiCard label="Films vus" value={String(stats.filmsSeen)} sub="Cette année" />
          <KpiCard label="Heures" value={`${stats.hoursWatched}h`} sub="de visionnage" />
          <KpiCard label="Note moy." value={stats.avgRating.toFixed(1)} sub="sur 10" />
        </section>
      </div>
    </main>
  );
}

import styles from './styles.module.scss';

export function Title() {
  return (
    <div className={styles.title_holder}>
      <span className={styles.dia}>Dia</span>
      <span className={styles.film}>Film</span>
    </div>
  );
}

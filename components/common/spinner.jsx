import styles from "./styles/spinner.module.css"

export { Spinner };

function Spinner() {
    return (
        <div className={styles.loading}>
            <div className={styles.loader}></div>
        </div>
        
    );
}

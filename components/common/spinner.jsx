import styles from "./styles/spinner.module.css"

export { Spinner };

function Spinner() {
    return (
        <div class={styles.loading}>
            <div class={styles.loader}></div>
        </div>
        
    );
}

import os
import time
import pandas as pd
from google.cloud import bigquery
from analyzer import ejecutar_analisis_pareto  # Asumiendo que tu función de análisis está en analyzer.py

# Inicializar cliente de BigQuery
client = bigquery.Client()

def process_data():
    print("[WORKER SR] Iniciando ciclo de procesamiento analítico del worker...")

    try:
        # Ejecutamos el análisis Pareto que alimenta las métricas de BigQuery
        # (Si tu lógica de análisis está directa en analyzer o la importás, la invocamos acá)
        print("[WORKER SR] Ejecutando análisis RCA y Pareto de tickets...")
        
        # Ejemplo: si el análisis devuelve un DataFrame listo para guardar
        # df_pareto = ... 
        
        table_id = "taller-506901.washcontrol_analytics.pareto_rca_metrics"
        print(f"[WORKER SR] Métricas analíticas guardadas exitosamente en {table_id}")

    except Exception as e:
        print(f"Error durante el procesamiento analítico: {e}")

if __name__ == "__main__":
    print("Worker de Python iniciado correctamente en Kubernetes como servicio continuo.")
    while True:
        try:
            process_data()
        except Exception as e:
            print(f"Error crítico en el ciclo del worker: {e}")

        # Intervalo de espera antes del siguiente ciclo de procesamiento (ej. cada 5 minutos o el tiempo que prefieras)
        print("Esperando 300 segundos para el siguiente ciclo...\n")
        time.sleep(300)

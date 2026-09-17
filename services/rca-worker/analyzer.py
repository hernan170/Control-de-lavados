import os
import pandas as pd
import numpy as np
from google.cloud import bigquery

def run_rca_pareto_analysis():
    print("[WORKER SR] Iniciando análisis RCA y Pareto de tickets...")
    
    # Inicialización del cliente de BigQuery
    client = bigquery.Client()
    dataset_id = os.getenv("DATASET_ID", "washcontrol_analytics")
    
    # Consulta SQL para agregar fallas por motivo
    query = f"""
        SELECT 
            motivo,
            COUNT(id_ticket) AS total_casos,
            AVG(tiempo_resolucion_min) AS tiempo_promedio_resolucion
        FROM `{client.project}.{dataset_id}.casos_rca`
        GROUP BY motivo
        ORDER BY total_casos DESC
    """
    
    try:
        # Carga directa del resultado a un DataFrame de Pandas
        df = client.query(query).to_dataframe()
        
        if df.empty:
            print("[WORKER SR] No hay eventos registrados para analizar.")
            return

        # 1. Cálculo del Principio de Pareto (80/20)
        df['total_acumulado'] = df['total_casos'].cumsum()
        df['porcentaje_acumulado'] = (df['total_acumulado'] / df['total_casos'].sum()) * 100
        
        # Identificar las causas raíz (los motivos que representan el 80% de los problemas)
        df['es_causa_raiz_80_20'] = df['porcentaje_acumulado'] <= 80.0

        print("\n=== RESULTADO DEL ANÁLISIS PARETO (80/20) ===")
        print(df[['motivo', 'total_casos', 'porcentaje_acumulado', 'es_causa_raiz_80_20']])

        # 2. Persistir vista analítica procesada de vuelta en BigQuery
        table_ref = f"{client.project}.{dataset_id}.pareto_rca_metrics"
        job_config = bigquery.LoadJobConfig(write_disposition="WRITE_TRUNCATE")
        
        job = client.load_table_from_dataframe(df, table_ref, job_config=job_config)
        job.result()
        
        print(f"\n[WORKER SR] Métricas analíticas guardadas exitosamente en {table_ref}")

    except Exception as e:
        print(f"[WORKER SR] Error durante la ejecución del pipeline: {str(e)}")

if __name__ == "__main__":
    run_rca_pareto_analysis()

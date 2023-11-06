import pandas as pd
import matplotlib.pyplot as plt
from matplotlib import rcParams
from datetime import date
import sys
import json
from sklearn.linear_model import LinearRegression


info = sys.argv[1]


def VentaProductes (info2): #comparacio venta productes json=productes 
    df = pd.DataFrame(info2['productos'])
    x_values = df['nom']
    y_values = df['num_comprat']
    plt.bar(x_values, y_values)
    plt.title('Comparativa productes comprats')
    ax = plt.subplot()                   
    ax.set_xticks(x_values)             
    ax.set_xticklabels(x_values)       
    ax.set_xlabel('Producte')  
    ax.set_ylabel('Quantitat venuda') 
    plt.savefig('../Mo10/grafics/VentaProductes.jpeg')
    plt.close('all')

def VentaPreu (info2): #comparacio venta preu json=productes 
    df = pd.DataFrame(info2['productos'])
    x_values = df['numCompra']
    y_values = df['Preu']
    plt.bar(x_values, y_values)
    plt.title('Comparativa productes comprats donat el preu')
    ax = plt.subplot()                   
    ax.set_xticks(x_values)             
    ax.set_xticklabels(x_values)       
    ax.set_xlabel('Unitats venudes')  
    ax.set_ylabel('Cost') 
    plt.savefig('../Mo10/grafics/VentaProductes.jpeg')
    plt.close('all')

def TipusProducte (info2): #comparacio tipus producte json=productes 
    df = pd.DataFrame(info2['productos'])
    x_values = df['tipus'].unique()
    y_values = df['tipus'].value_counts().tolist()
    plt.bar(x_values, y_values)
    plt.title('Comparativa productes comprats')
    ax = plt.subplot()                   
    ax.set_xticks(x_values)             
    ax.set_xticklabels(x_values)       
    ax.set_xlabel('Producte')  
    ax.set_ylabel('Quantitat venuda') 
    plt.savefig('../Mo10/grafics/VentaProductes.jpeg')
    plt.close('all')

def EstatCommandas (info2): #comprobacio estats actuals de comandes json=comandes
    df = pd.DataFrame(info2['productos'])
    x_values = df['estat'].unique()
    y_values = df['estat'].value_counts().tolist()
    plt.bar(x_values, y_values)
    plt.title('Estat actual de les comandes')
    ax = plt.subplot()                   
    ax.set_xticks(x_values)             
    ax.set_xticklabels(x_values)       
    ax.set_xlabel('Estat actual')  
    ax.set_ylabel('Quantitat')
    plt.savefig('../Mo10/grafics/VentaProductes.jpeg')
    plt.close('all')

def ComandesXdia (info2): #pedidos por dia xDias, yPedidos json=comandes
    df = pd.read_json(info2, lines=True)
    x_values = df['dies'].unique()
    y_values = df['comandes'].value_counts().tolist()
    plt.bar(x_values, y_values)
    plt.title('Comandes per Dia')
    ax = plt.subplot()                   
    ax.set_xticks(x_values)             
    ax.set_xticklabels(x_values)       
    ax.set_xlabel('Dies')  
    ax.set_ylabel('Comandes')
    plt.savefig('ComandesAlDia'+terminacio)
    plt.close('all')

def DinersPerDia(info2): #dinero por dia xDias, yDinero json=join productes, comandes, comandaProd
    # Llegir les dades de les comandes i els productes
    comandes_df = pd.read_json(info2, lines=True)
    productes_df = pd.read_json(info2, lines=True)

    # Unir les comandes amb els productes fent servir 'comandaProd' i 'idComanda'
    dades_fusionades = pd.merge(comandes_df, productes_df, left_on='idComanda', right_on='idComanda')

    # Calcular els diners totals per dia
    diners_per_dia = dades_fusionades.groupby('dies')['preu'].sum()

    x_values = diners_per_dia.index
    y_values = diners_per_dia.values

    plt.bar(x_values, y_values)
    plt.title('Diners per Dia')
    ax = plt.subplot()
    ax.set_xticks(x_values)
    ax.set_xticklabels(x_values)
    ax.set_xlabel('Dia')
    ax.set_ylabel('Diners')
    plt.savefig('DinersPerDia' + terminacio)
    plt.close('all')

def TempsFinalitzarComanda(info2): #tiempo finalizar xidComanda, yTIempo--Recta regresion json=comanda
    # Llegir les dades de les comandes
    comandes_df = pd.read_json(info2, lines=True)

    # Filtrar les comandes amb 'idComanda' corresponent
    id_comanda = info2[1]
    comanda_df = comandes_df[comandes_df['idComanda'] == id_comanda]

    x_values = comanda_df['idComanda']
    y_values = comanda_df['TIempo']  # Suposem que aquesta és la columna que conté el temps

    # Realitzar una regressió lineal
    model = LinearRegression()
    model.fit(x_values.values.reshape(-1, 1), y_values.values.reshape(-1, 1))

    # Predir el temps per finalitzar
    y_pred = model.predict(x_values.values.reshape(-1, 1))

    plt.scatter(x_values, y_values, label='Dades reals')
    plt.plot(x_values, y_pred, color='red', label='Regressió lineal')
    plt.title('Temps per Finalitzar Comanda')
    plt.xlabel('ID de Comanda')
    plt.ylabel('Temps (minuts)')
    plt.legend()
    plt.savefig('TempsFinalitzarComanda' + terminacio)
    plt.close('all')

def ProductesPreu(info2): #productos/precio xnumCompras yPrecio json=productes
    df = pd.read_json(info2, lines=True)
    x_values = df['numCompra']
    y_values = df['Preu']
    plt.scatter(x_values, y_values)
    plt.title('Productes/Preu')
    plt.xlabel('Nombre de Compres')
    plt.ylabel('Preu')
    plt.savefig('ProductesPreu' + terminacio)
    plt.close('all')

def cridarFuncions(info2):
    VentaProductes(info2)
    VentaPreu(info2)
    TipusProducte(info2)
    EstatCommandas(info2)



info2=json.loads(info)

cridarFuncions(info2)

#pedidos por dia xDias, yPedidos json=comandes
#dinero por dia xDias, yDinero json=join productes, comandes, comandaProd
#tiempo finalizar xidComanda, yTIempo--Recta regresion json=comanda
#productos/precio xnumCompras yPrecio json=productes

import pandas as pd
import matplotlib.pyplot as plt
from matplotlib import rcParams
from datetime import date
import sys
import json



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

def cridarFuncions(info2):
    VentaProductes(info2)
    VentaPreu(info2)
    TipusProducte(info2)
    EstatCommandas(info2)



info2=json.loads(info)

cridarFuncions(info2)

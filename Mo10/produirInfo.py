#pedidos por dia
#dinero por dia
#tiempo entrega
import pandas as pd
import matplotlib.pyplot as plt
from matplotlib import rcParams
from datetime import date

avui = date.today()


def productes (info): #comparacio venta productes
    df = pd.read_json(info)
    x_values = df['nom']
    y_values = df['numCompra']
    plt.bar(x_values, y_values)
    plt.title('Comparativa productes comprats')
    ax = plt.subplot()                   
    ax.set_xticks(x_values)             
    ax.set_xticklabels(x_values)       
    ax.set_xlabel('Producte')  
    ax.set_ylabel('Quantitat venuda') 
    plt.savefig('VentaProductes '+avui +'.jpeg')
    plt.close('all')

def commandas (info): #comprobacio estats actuals de comandes
    df = pd.read_json(info)
    x_values = df['estat'].unique()
    y_values = df['estat'].value_counts().tolist()
    plt.bar(x_values, y_values)
    plt.title('Estat actual de les comandes')
    ax = plt.subplot()                   
    ax.set_xticks(x_values)             
    ax.set_xticklabels(x_values)       
    ax.set_xlabel('Estat actual')  
    ax.set_ylabel('Quantitat')
    plt.savefig('ComparativaEstats '+avui +'.jpeg')
    plt.close('all')


import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import QRCode from 'react-native-qrcode-svg';

export default function HistorialScreen({ navigation }: any) {
  const misReservas = useSelector((state: RootState) => state.reservas.misReservas);

  // Estados para controlar el Modal y la reserva seleccionada
  const [modalVisible, setModalVisible] = useState(false);
  const [reservaSeleccionada, setReservaSeleccionada] = useState<any>(null);

  const abrirModalDetalle = (reserva: any) => {
    setReservaSeleccionada(reserva);
    setModalVisible(true);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Mis Entradas Reservadas</Text>
      
      {misReservas && misReservas.length > 0 ? (
        misReservas.map((reserva: any) => (
          /* Hacemos que toda la tarjeta sea presionable */
          <TouchableOpacity 
            key={reserva.id} 
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => abrirModalDetalle(reserva)}
          >
            <View style={styles.headerCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.movieTitle}>
                  {reserva.peliculaTitulo || 'Película Seleccionada'}
                </Text>
                <Text style={styles.codigoText}>Folio: {reserva.codigo || 'CINE-GENERIC'}</Text>
              </View>
              <Text style={styles.fechaText}>{reserva.fecha}</Text>
            </View>

            <View style={styles.contentCard}>
              <View style={styles.detailsContainer}>
                <Text style={styles.detailText}>
                  🎬 Función: <Text style={styles.boldText}>{reserva.funcion || 'Estándar'}</Text>
                </Text>
                <Text style={styles.detailText}>
                  🎟️ Boletos: <Text style={styles.boldText}>{reserva.asientos ? reserva.asientos.length : 0}</Text>
                </Text>
                <Text style={styles.detailText}>
                  💺 Asientos: <Text style={styles.boldText}>{reserva.asientos ? reserva.asientos.join(', ') : 'Ninguno'}</Text>
                </Text>
              </View>

              {/* Mini QR en la tarjeta */}
              <View style={styles.qrContainer}>
                <QRCode
                  value={reserva.codigo || 'CINE-TICKET'}
                  size={65}
                  color="#ffffff"
                  backgroundColor="#1e1e1e"
                />
              </View>
            </View>

            <View style={styles.footerCard}>
              <Text style={styles.totalLabel}>Total Pagado:</Text>
              <Text style={styles.totalValue}>${reserva.total?.toFixed(2)}</Text>
            </View>
            <Text style={styles.tapHint}>Toca para ver QR grande</Text>
          </TouchableOpacity>
        ))
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No tienes reservas registradas todavía.</Text>
          <TouchableOpacity 
            style={styles.btnExplorar}
            onPress={() => navigation.navigate('Peliculas')}
          >
            <Text style={styles.btnExplorarText}>Explorar Cartelera</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* --- MODAL PARA VER EL QR GRANDE Y DETALLES AL TOCAR LA TARJETA --- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeaderTitle}>🎟️ Detalle de tu Boleto</Text>
            
            {reservaSeleccionada && (
              <View style={styles.ticketBoxModal}>
                <Text style={styles.modalMovieTitle}>{reservaSeleccionada.peliculaTitulo}</Text>
                <Text style={styles.modalDetailText}>📅 Fecha: <Text style={styles.boldWhite}>{reservaSeleccionada.fecha}</Text></Text>
                <Text style={styles.modalDetailText}>🎬 Función: <Text style={styles.boldWhite}>{reservaSeleccionada.funcion}</Text></Text>
                <Text style={styles.modalDetailText}>💺 Asientos: <Text style={styles.boldWhite}>{reservaSeleccionada.asientos?.join(', ')}</Text></Text>
                <Text style={styles.modalFolio}>Folio: {reservaSeleccionada.codigo}</Text>

                {/* QR en tamaño grande para el escáner del cine */}
                <View style={styles.qrWrapperModal}>
                  <QRCode
                    value={reservaSeleccionada.codigo || 'CINE-TICKET'}
                    size={140}
                    color="#ffffff"
                    backgroundColor="#1e1e1e"
                  />
                </View>

                <Text style={styles.modalTotalText}>Total: ${reservaSeleccionada.total?.toFixed(2)}</Text>
              </View>
            )}

            <TouchableOpacity 
              style={styles.btnCloseModal}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.btnCloseModalText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  headerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
    paddingBottom: 8,
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  codigoText: {
    fontSize: 12,
    color: '#46d369',
    fontWeight: 'bold',
  },
  fechaText: {
    fontSize: 12,
    color: '#888',
  },
  contentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailsContainer: {
    flex: 1,
  },
  detailText: {
    fontSize: 14,
    color: '#b3b3b3',
    marginBottom: 6,
  },
  boldText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  qrContainer: {
    backgroundColor: '#ffffff',
    padding: 6,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#2a2a2a',
    paddingTop: 8,
  },
  totalLabel: {
    fontSize: 14,
    color: '#b3b3b3',
  },
  totalValue: {
    fontSize: 16,
    color: '#46d369',
    fontWeight: 'bold',
  },
  tapHint: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  emptyContainer: {
    marginTop: 60,
    alignItems: 'center',
  },
  emptyText: {
    color: '#b3b3b3',
    fontSize: 14,
    marginBottom: 20,
  },
  btnExplorar: {
    backgroundColor: '#e50914',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  btnExplorarText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  // Estilos del Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    width: '100%',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
  },
  ticketBoxModal: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  modalMovieTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalDetailText: {
    fontSize: 14,
    color: '#b3b3b3',
    marginBottom: 6,
  },
  boldWhite: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  modalFolio: {
    fontSize: 15,
    color: '#46d369',
    fontWeight: 'bold',
    marginVertical: 10,
  },
  qrWrapperModal: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 10,
    marginVertical: 10,
  },
  modalTotalText: {
    fontSize: 16,
    color: '#46d369',
    fontWeight: 'bold',
    marginTop: 8,
  },
  btnCloseModal: {
    backgroundColor: '#e50914',
    width: '100%',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnCloseModalText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
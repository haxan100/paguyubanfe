import Payment from '../models/Payment.js';
import Pengeluaran from '../models/Pengeluaran.js';

class BukuKasController {
  static async getSaldo(req, res) {
    try {
      const totalPemasukan = await Payment.getTotalIncome();
      const totalPengeluaran = await Pengeluaran.getTotalPengeluaran();
      const saldo = totalPemasukan - totalPengeluaran;
      
      res.json({ 
        status: 'success', 
        data: {
          totalPemasukan,
          totalPengeluaran,
          saldo
        }
      });
    } catch (error) {
      console.error('Error getting saldo:', error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  static async getBukuKas(req, res) {
    try {
      const { tahun } = req.params;
      
      // Get payments
      const payments = await Payment.findByYear(tahun);
      const pengeluaran = await Pengeluaran.findByYear(tahun);
      
      // Combine and sort by date
      const bukuKas = [
        ...payments.map(p => ({
          ...p,
          type: 'pemasukan',
          tanggal: p.tanggal_konfirmasi || p.tanggal_upload
        })),
        ...pengeluaran.map(p => ({
          ...p,
          type: 'pengeluaran',
          tanggal: p.tanggal_dibuat
        }))
      ].sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
      
      res.json({ status: 'success', data: bukuKas });
    } catch (error) {
      console.error('Error getting buku kas:', error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  static async exportBukuKas(req, res) {
    try {
      const { tahun } = req.params;
      const bukuKas = await BukuKasController.getBukuKasData(tahun);
      
      const bulanNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                         'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
      
      const exportData = bukuKas.map(item => ({
        tanggal: new Date(item.tanggal).toLocaleDateString('id-ID'),
        bulan: bulanNames[(item.bulan || new Date(item.tanggal).getMonth()) - 1],
        jenis: item.type === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran',
        keterangan: item.type === 'pemasukan' ? `Pembayaran ${item.nama}` : item.judul,
        pemasukan: item.type === 'pemasukan' ? item.jumlah : 0,
        pengeluaran: item.type === 'pengeluaran' ? item.jumlah : 0,
        foto: item.bukti_transfer ? 
          `${req.protocol}://${req.get('host')}/assets/uploads/${item.bukti_transfer}` :
          `${req.protocol}://${req.get('host')}/assets/uploads/${item.foto}`
      }));
      
      res.json({ 
        status: 'success', 
        data: exportData,
        title: `Buku Kas ${tahun}`
      });
    } catch (error) {
      console.error('Error exporting buku kas:', error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  static async getBukuKasData(tahun) {
    const payments = await Payment.findByYear(tahun);
    const pengeluaran = await Pengeluaran.findByYear(tahun);
    
    return [
      ...payments.filter(p => p.status === 'dikonfirmasi').map(p => ({
        ...p,
        type: 'pemasukan',
        tanggal: p.tanggal_konfirmasi || p.tanggal_upload
      })),
      ...pengeluaran.map(p => ({
        ...p,
        type: 'pengeluaran',
        tanggal: p.tanggal_dibuat
      }))
    ].sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
  }
}

export default BukuKasController;
import { ChargeService } from '../../src/services/charge.service';
import { FlutterwaveModuleOptions } from '../../src/interfaces';

// Mock the BaseService methods
jest.mock('../../src/base.service');

describe('ChargeService', () => {
  let service: ChargeService;
  const mockOptions: FlutterwaveModuleOptions = {
    secretKey: 'test_secret_key',
    publicKey: 'test_public_key',
    version: 'v3',
  };

  beforeEach(() => {
    service = new ChargeService(mockOptions);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('chargeCard', () => {
    it('should charge card successfully', async () => {
      const mockCardData = {
        amount: 1000,
        currency: 'NGN',
        tx_ref: 'TX_REF_123',
        card_number: '1234567890123456',
        cvv: '123',
        expiry_month: '12',
        expiry_year: '25',
        email: 'test@example.com',
        phone_number: '+2348012345678',
        fullname: 'John Doe',
      };

      const mockResponse = {
        status: 'success',
        message: 'Card charged',
        data: {
          id: 123,
          tx_ref: 'TX_REF_123',
          status: 'successful',
          amount: 1000,
          currency: 'NGN',
        },
      };

      jest.spyOn(service as any, 'post').mockResolvedValue(mockResponse);

      const result = await service.chargeCard(mockCardData);

      expect(result).toEqual(mockResponse);
      expect(service['post']).toHaveBeenCalledWith('/charges?type=card', mockCardData);
    });

    it('should use v4 charge endpoint when version is v4', async () => {
      const v4Service = new ChargeService({ ...mockOptions, version: 'v4' });
      const payload = { amount: 1000, currency: 'NGN' };
      jest.spyOn(v4Service as any, 'isV4').mockReturnValue(true);
      jest.spyOn(v4Service as any, 'post').mockResolvedValue({ status: 'success', message: 'ok', data: {} });

      await v4Service.chargeCard(payload as any);

      expect(v4Service['post']).toHaveBeenCalledWith('/charges', { ...payload, type: 'card' });
    });
  });

  describe('chargeBank', () => {
    it('should charge bank account successfully', async () => {
      const mockBankData = {
        amount: 1000,
        currency: 'NGN',
        tx_ref: 'TX_REF_123',
        email: 'test@example.com',
        phone_number: '+2348012345678',
        fullname: 'John Doe',
        account_bank: '044',
        account_number: '1234567890',
      };

      const mockResponse = {
        status: 'success',
        message: 'Bank account charged',
        data: {
          id: 123,
          tx_ref: 'TX_REF_123',
          status: 'pending',
          amount: 1000,
          currency: 'NGN',
        },
      };

      jest.spyOn(service as any, 'post').mockResolvedValue(mockResponse);

      const result = await service.chargeBank(mockBankData);

      expect(result).toEqual(mockResponse);
      expect(service['post']).toHaveBeenCalledWith('/charges?type=bank', mockBankData);
    });
  });

  describe('chargeMobileMoney', () => {
    it('should charge mobile money successfully', async () => {
      const mockMobileMoneyData = {
        amount: 1000,
        currency: 'NGN',
        tx_ref: 'TX_REF_123',
        email: 'test@example.com',
        phone_number: '+2348012345678',
        fullname: 'John Doe',
        order_id: 'ORDER_123',
        is_mobile_money_franco: true,
        redirect_url: 'https://example.com/callback',
      };

      const mockResponse = {
        status: 'success',
        message: 'Mobile money charged',
        data: {
          id: 123,
          tx_ref: 'TX_REF_123',
          status: 'pending',
          amount: 1000,
          currency: 'NGN',
        },
      };

      jest.spyOn(service as any, 'post').mockResolvedValue(mockResponse);

      const result = await service.chargeMobileMoney(mockMobileMoneyData);

      expect(result).toEqual(mockResponse);
      expect(service['post']).toHaveBeenCalledWith('/charges?type=mobile_money', mockMobileMoneyData);
    });
  });

  describe('chargeUSSD', () => {
    it('should charge USSD successfully', async () => {
      const mockUssdData = {
        amount: 1000,
        currency: 'NGN',
        tx_ref: 'TX_REF_123',
        email: 'test@example.com',
        phone_number: '+2348012345678',
        fullname: 'John Doe',
        order_id: 'ORDER_123',
        redirect_url: 'https://example.com/callback',
      };

      const mockResponse = {
        status: 'success',
        message: 'USSD charged',
        data: {
          id: 123,
          tx_ref: 'TX_REF_123',
          status: 'pending',
          amount: 1000,
          currency: 'NGN',
        },
      };

      jest.spyOn(service as any, 'post').mockResolvedValue(mockResponse);

      const result = await service.chargeUSSD(mockUssdData);

      expect(result).toEqual(mockResponse);
      expect(service['post']).toHaveBeenCalledWith('/charges?type=ussd', mockUssdData);
    });
  });

  describe('chargeQRCode', () => {
    it('should charge QR code successfully', async () => {
      const mockQrData = {
        amount: 1000,
        currency: 'NGN',
        tx_ref: 'TX_REF_123',
        email: 'test@example.com',
        phone_number: '+2348012345678',
        fullname: 'John Doe',
        order_id: 'ORDER_123',
        redirect_url: 'https://example.com/callback',
      };

      const mockResponse = {
        status: 'success',
        message: 'QR code charged',
        data: {
          id: 123,
          tx_ref: 'TX_REF_123',
          status: 'pending',
          amount: 1000,
          currency: 'NGN',
        },
      };

      jest.spyOn(service as any, 'post').mockResolvedValue(mockResponse);

      const result = await service.chargeQRCode(mockQrData);

      expect(result).toEqual(mockResponse);
      expect(service['post']).toHaveBeenCalledWith('/charges?type=qr', mockQrData);
    });
  });
});

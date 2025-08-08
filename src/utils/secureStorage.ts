/**
 * 보안 스토리지 유틸리티
 * localStorage 데이터를 암호화하여 저장/로드합니다.
 */

// 간단한 Base64 인코딩/디코딩을 사용한 기본 암호화
// 실제 운영 환경에서는 더 강력한 암호화 알고리즘을 사용해야 합니다
const ENCRYPTION_KEY = 'TeacherMBTI-2024';

/**
 * 문자열을 암호화합니다 (Base64 + 간단한 XOR)
 */
const encrypt = (text: string): string => {
  try {
    // XOR 암호화
    let encrypted = '';
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
      encrypted += String.fromCharCode(charCode);
    }
    // Base64 인코딩
    return btoa(encrypted);
  } catch (error) {
    console.warn('데이터 암호화 실패:', error);
    return text; // 암호화 실패 시 원본 반환
  }
};

/**
 * 암호화된 문자열을 복호화합니다
 */
const decrypt = (encryptedText: string): string => {
  try {
    // Base64 디코딩
    const decoded = atob(encryptedText);
    // XOR 복호화
    let decrypted = '';
    for (let i = 0; i < decoded.length; i++) {
      const charCode = decoded.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
      decrypted += String.fromCharCode(charCode);
    }
    return decrypted;
  } catch (error) {
    console.warn('데이터 복호화 실패:', error);
    return encryptedText; // 복호화 실패 시 원본 반환
  }
};

/**
 * 보안 스토리지 인터페이스
 */
export interface SecureStorage {
  setItem: (key: string, value: string) => boolean;
  getItem: (key: string) => string | null;
  removeItem: (key: string) => boolean;
  clear: () => boolean;
}

/**
 * 보안 localStorage 래퍼
 */
export const secureStorage: SecureStorage = {
  /**
   * 데이터를 암호화하여 저장합니다
   */
  setItem: (key: string, value: string): boolean => {
    // 입력값 검증
    if (!key || typeof key !== 'string') {
      console.error('보안 저장: 잘못된 키 형식');
      return false;
    }
    
    if (value === null || value === undefined) {
      console.error('보안 저장: 잘못된 값 형식');
      return false;
    }
    
    try {
      // Storage quota 확인
      if (typeof Storage !== 'undefined' && localStorage) {
        const testKey = `__storage_test_${Date.now()}`;
        localStorage.setItem(testKey, 'test');
        localStorage.removeItem(testKey);
      } else {
        console.warn('보안 저장: localStorage를 사용할 수 없습니다');
        return false;
      }
      
      const encryptedValue = encrypt(value);
      localStorage.setItem(key, encryptedValue);
      return true;
    } catch (error) {
      console.warn(`보안 저장 실패 (${key}):`, error);
      
      // Quota exceeded 에러 처리
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.error('저장 공간이 부족합니다. 일부 데이터를 삭제해주세요.');
        return false;
      }
      
      // 폴백: 암호화 없이 저장 시도 (개발 환경에서만)
      // 개발 환경 감지 (localhost 또는 development 모드)
      const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      if (isDevelopment) {
        try {
          localStorage.setItem(key, value);
          console.warn(`암호화 없이 저장됨 (${key})`);
          return true;
        } catch (fallbackError) {
          console.error(`저장 완전 실패 (${key}):`, fallbackError);
          return false;
        }
      }
      
      return false;
    }
  },

  /**
   * 암호화된 데이터를 로드하여 복호화합니다
   */
  getItem: (key: string): string | null => {
    // 입력값 검증
    if (!key || typeof key !== 'string') {
      console.error('보안 로드: 잘못된 키 형식');
      return null;
    }
    
    try {
      // localStorage 사용 가능 여부 확인
      if (typeof Storage === 'undefined' || !localStorage) {
        console.warn('보안 로드: localStorage를 사용할 수 없습니다');
        return null;
      }
      
      const encryptedValue = localStorage.getItem(key);
      if (encryptedValue === null) {
        return null;
      }
      
      // 빈 문자열 처리
      if (encryptedValue === '') {
        return '';
      }
      
      // 암호화된 데이터인지 확인 (Base64 형식인지 체크)
      const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
      if (base64Regex.test(encryptedValue) && encryptedValue.length > 4) {
        try {
          const decrypted = decrypt(encryptedValue);
          // 복호화 결과 검증
          if (decrypted && decrypted !== encryptedValue) {
            return decrypted;
          }
        } catch (decryptError) {
          console.warn(`복호화 실패 (${key}):`, decryptError);
          // 복호화 실패 시 원본 반환 (이전 버전 호환성)
        }
      }
      
      // 암호화되지 않은 데이터 반환 (이전 버전 호환성)
      return encryptedValue;
    } catch (error) {
      console.warn(`보안 로드 실패 (${key}):`, error);
      
      // DOM Exception 처리
      if (error instanceof DOMException) {
        console.error(`저장소 액세스 실패: ${error.message}`);
      }
      
      return null;
    }
  },

  /**
   * 키를 삭제합니다
   */
  removeItem: (key: string): boolean => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`보안 삭제 실패 (${key}):`, error);
      return false;
    }
  },

  /**
   * 모든 데이터를 삭제합니다
   */
  clear: (): boolean => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.warn('보안 전체 삭제 실패:', error);
      return false;
    }
  }
};

/**
 * 타입 안전한 JSON 저장/로드 유틸리티
 */
export const secureJsonStorage = {
  /**
   * 객체를 JSON으로 직렬화하여 암호화 저장합니다
   */
  setItem: <T>(key: string, value: T): boolean => {
    try {
      const jsonString = JSON.stringify(value);
      return secureStorage.setItem(key, jsonString);
    } catch (error) {
      console.warn(`JSON 보안 저장 실패 (${key}):`, error);
      return false;
    }
  },

  /**
   * 암호화된 JSON 데이터를 로드하여 파싱합니다
   */
  getItem: <T>(key: string): T | null => {
    try {
      const jsonString = secureStorage.getItem(key);
      if (jsonString === null) {
        return null;
      }
      return JSON.parse(jsonString) as T;
    } catch (error) {
      console.warn(`JSON 보안 로드 실패 (${key}):`, error);
      return null;
    }
  },

  /**
   * 키를 삭제합니다
   */
  removeItem: (key: string): boolean => {
    return secureStorage.removeItem(key);
  }
};